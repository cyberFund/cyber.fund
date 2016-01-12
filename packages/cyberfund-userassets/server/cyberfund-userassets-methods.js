var logger = log4js.getLogger("assets-tracker");

/**
 * converts crypto-balance token to chaingear system name.
 * @param cryptoBalanceToken - token received from crypto-balance library
 * @returns {CG system name OR false - if autoupdate is disabled.}
 */

CF.UserAssets.qMatchingTable = {
  'BTC': 'Bitcoin',
  'MAID': 'MaidSafeCoin',
  'OA/CFUND': 'cyberFund'
};

CF.UserAssets.tokenCB2systemCG = function (cryptoBalanceToken) {
  var matchingTable = CF.UserAssets.qMatchingTable;
  // todo: just recalculate matchingTable if chaingear reloads.
  // todo: so to avoid constand db poll here
  var ret =  matchingTable[cryptoBalanceToken] || false;
  if (!ret) {
    var record = CurrentData.findOne({"aliases.quantum": cryptoBalanceToken});
    ret = record ? record._id : false;
  }
  return ret
};

var checkForFixedMissingItems_Cryptobalance = function() {
  var missing_items = Extras.find({
    "meta.type": "report",
    "meta.domain": "cryptobalance"
  }).fetch();

  var list = [];
  _.each(missing_items, function (item) {
    if (!item._id) {
      console.log(item); return;
    }
    var id = item._id.split('_cryptoasset_missing');
    if (id.length != 2) return;
    if (CF.UserAssets.tokenCB2systemCG(id[0])) list.push(id[0]+"_cryptoasset_missing");
  });

  if (list.length) {
    Extras.remove({_id: {$in: list}})
  }
};

Meteor.startup(function () {
  checkForFixedMissingItems_Cryptobalance();
});

Meteor.methods({
  quantumCheck: function(address){
    check(address, String);
    console.log(address)
    var s = "http://quantum.cyber.fund:3001?address="+address;// "http://quantum.cyber.fund:3001/?address="+address;

    var r = HTTP.call("GET", s, {},
    function(err, result, body){
      console.log(err);
      console.log(result);
      console.log(body);
      try {
        //var ret = JSON.parse(result.content);
        //console.log(ret);
        //return ret;
      } catch (e) {

        return e;
      }
    });


  },
  cfAssetsUpdateBalance: function (accountKey, address) {
    if (!this.userId) {
      return;
    }
    //
    var key0 = CF.UserAssets.getAccountPrivacyType(this.userId, accountKey);
    if (!key0) return;
    var fields = {};
    fields[key0] = 1;
    var sel = {_id: this.userId};
    var accounts = Meteor.users.findOne(sel, {fields: fields})[key0] || {};

    if (!accountKey) { //todo: update all balances for user
      //
      return;
    }
    if (!address) { //todo: update all balances for account
      //
      return;
    }

    var addressObj = accounts[accountKey] && accounts[accountKey].addresses
      && accounts[accountKey].addresses[address];
    if (!addressObj) return;
    var modify = {$set: {}, $unset: {}};

    var key = [key0, accountKey, 'addresses', address, 'assets'].join(".");
    _.each(addressObj.assets, function (asset, assetKey) {
      if (asset.update === 'auto') {
        modify.$unset[[key, assetKey].join('.')] = "true"
      }
    });

    CF.checkBalance(address, Meteor.bindEnvironment(function (err, result) {
        if (!err && result) {
          _.each(result, function (item) {
            if (item.status != 'success') return;
console.log(item)
            // resolve cryptobalance ticker into chaingear ticker
            item.Asset = CF.UserAssets.tokenCB2systemCG(item.asset);

            if (!item.Asset) {
              Extras.upsert({_id: item.asset + "_cryptoasset_missing"}, {
                meta: {
                  type: "report",
                  domain: "cryptobalance",
                  sampleAddress: address
                }
              });
              return;
            }

            var q;
            try {
              q = parseFloat(item.quantity)
            } catch (e) {
              q = item.quantity;
            }
            var k = [key, item.Asset].join(".");
            modify.$set[k] = {
              update: 'auto',
              quantity: q,
              asset: item.Asset,
              updatedAt: new Date(),
              service: item.service,
              address: item.address
            };
            delete modify.$unset[k];
          });

          // clear empty modifiers
          if (_.isEmpty(modify.$unset)) delete(modify.$unset);
          if (_.isEmpty(modify.$set)) delete(modify.$set);

          // if modifier not empty
          if (_.keys(modify).length) {
            var k0 = [key0, accountKey, 'addresses', address, 'updatedAt'].join('.');
            modify.$set[k0] = new Date();
            Meteor.users.update(sel, modify);
          }
        }
      })
    );
  },

  "cfAssetsAddAddress": function (accountKey, address) {
    //decide what to update
    var userId = this.userId;
    if (!this.userId) return;
    var key0 = CF.UserAssets.getAccountPrivacyType(userId, accountKey);
    if (!key0) return;
    var key = [key0, accountKey, "addresses", address].join(".");
    var set = {$set: {}};
    set.$set[key] = {assets: {}};
    //push account to dictionary of accounts, so can use in autocomplete later
    Meteor.users.update({_id: userId}, set);
    Meteor.call("cfAssetsUpdateBalance", accountKey, address)
  },

  cfAssetsRemoveAddress: function (accountKey, asset) {
    var userId = this.userId;
    if (!userId) return;

    var key0 = CF.UserAssets.getAccountPrivacyType(userId, accountKey);
    if (!key0) return;
    var fields = {};
    fields[key0] = 1;
    var sel = {_id: this.userId};
    var accounts = Meteor.users.findOne(sel, {fields: fields})[key0] || {};

    var key = [key0, accountKey, "addresses", asset].join(".");
    var unset = {$unset: {}};
    unset.$unset[key] = true;
    Meteor.users.update({_id: userId}, unset);
  },

  cfAssetsAddAccount: function (obj) {
    if (!this.userId) return {err: "no userid"};
    var sel = {_id: this.userId};
    check(obj, Match.ObjectIncluding({isPublic: Boolean, name: String}));
    var user = Meteor.users.findOne(sel);

    var key0 = obj.isPublic ? 'accounts' : 'accountsPrivate';

    var set = {};
    set[key0] = {};
    if (!user[key0]) Meteor.users.update(sel, {$set: set});

    var privates = user.accountsPrivate || {};

    if (!CF.UserAssets.accountNameIsValid(obj.name, user[key0])) return {err: "invalid acc name"};

    // find next account #
    var key = CF.UserAssets.nextKey(_.extend(user.accounts || {}, privates));
    var $set = {};

    $set[[key0, key].join('.')] = {
      name: obj.name,
      addresses: {}
    };

    var r = Meteor.users.update(sel, {$set: $set});
    if (obj.address) Meteor.call('cfAssetsAddAddress', key, obj.address);
    return {newAccountKey: key};
  },

  cfAssetsRenameAccount: function (accountKey, newName) {
    if (!this.userId) return;
    var sel = {_id: this.userId};
    var key0 = CF.UserAssets.getAccountPrivacyType(this.userId, accountKey);
    if (!key0) return;

    var accounts = Meteor.users.findOne(sel)[key0];
    if (!accounts || !accounts[accountKey]) {
      return;
    }
    var checkName = CF.UserAssets.accountNameIsValid(newName, accounts, accounts[accountKey].name);
    if (checkName) {
      var k = [key0, accountKey, "name"].join('.');
      var set = {$set: {}};
      set.$set[k] = newName;
      Meteor.users.update(sel, set);
    }
  },
  cfAssetsRemoveAccount: function (accountKey) {
    if (!this.userId) return;
    var key0 = CF.UserAssets.getAccountPrivacyType(this.userId, accountKey);
    if (!key0) return;
    var k = [key0, accountKey].join('.');
    var unset = {$unset: {}};
    unset.$unset[k] = true;
    Meteor.users.update({_id: this.userId}, unset);
  },

  cfAssetsAddAsset: function (accountKey, address, asset, q) {
    if (!this.userId) return;
    var key0 = CF.UserAssets.getAccountPrivacyType(this.userId, accountKey);
    if (!key0) return;
    var sel = {_id: this.userId};
    var modify = {$set: {}};
    var key = [key0, accountKey, 'addresses', address, 'assets', asset].join(".");
    modify.$set[key] = {
      asset: asset,
      quantity: q,
      update: 'manual'
    };
    Meteor.users.update(sel, modify)
  },
  cfAssetsDeleteAsset: function (accountKey, address, asset) {
    if (!this.userId) return;
    var key0 = CF.UserAssets.getAccountPrivacyType(this.userId, accountKey);
    if (!key0) return;
    var sel = {_id: this.userId};
    var modify = {$unset: {}};
    var key = [key0, accountKey, 'addresses', address, 'assets', asset].join(".");
    modify.$unset[key] = true;
    Meteor.users.update(sel, modify)
  },
  'cfAssetsTogglePrivacy': function (accountKey, fromKey) {
    //{{! todo: add check if user is able using this feature}}
    if (!this.userId) return false;

    var toKey = fromKey == 'accounts' ? 'accountsPrivate' : 'accounts';

    var user = Meteor.users.findOne({_id: this.userId});
    var account = user[fromKey];
    if (!account) return false;
    account = account[accountKey];
    if (!account) return false;
    logger.info("user " + this.userId + " ordered turning account " + account.name + " to " + toKey);
    var unset = {}, set = {};
    set[[toKey, accountKey].join(".")] = account;
    unset[[fromKey, accountKey].join(".")] = true;
    Meteor.users.update({_id: this.userId}, {$unset: unset, $set: set});
  }
});
