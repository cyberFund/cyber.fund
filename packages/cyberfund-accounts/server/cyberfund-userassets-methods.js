var ns = CF.UserAssets;
var nsn = "CF.UserAssets."

var logger = CF.Utils.logger.getLogger("meteor-fetching");
var print = logger.print/*function(really) {
  return (really ? new CF.Utils.logger.getLogger('balance updater').print : function() {})
}(true)*/

//

var _k = CF.Utils._k;

ns.quantumCheck = function(address) { // moving to CF.Accounts
  try {
    print("checking address", address, true)
    var r = HTTP.call("GET", "http://quantum.cyber.fund:3001?address=" + address);
    if (r.statusCode == 200)
      return r.data;
  } catch (e) {
    print("on checking address " + address + " quantum returned code ",
      e && e.response && e.response.statusCode, true)
    return ['error'];
  }
}
/*  TODO test CF.Accounts
// per single address
ns.updateBalance = function(userId, accountKey, address, isOwn) {
  if (!userId || !accountKey || !address) {
    print("updateBalance: missing arguments", [userId, accountKey, address].join("; "))
    return;
  }

  var key0 = ns.getAccountPrivacyType(userId, accountKey);
  if (!key0) return;

  var isOwn = userId === Meteor.userId();
  if (key0 == 'accountsPrivate' && !isOwn) return;

  var sel = {
    _id: userId
  };
  var accounts = Meteor.users.findOne(sel, {
    fields: ns.accountsFields(isOwn)
  }) || {};
  accounts = accounts[key0] || {}

  var addressObj = accounts[accountKey] && accounts[accountKey].addresses && accounts[accountKey].addresses[address];
  if (!addressObj) {
    print("no address obj", true, true);
    print("accounts", accounts, true);
    print("address", address)

    return;
  }

  var modify = {
    $set: {},
    $unset: {}
  };

  var key = [key0, accountKey, 'addresses', address, 'assets'].join(".");
  _.each(addressObj.assets, function(asset, assetKey) {
    if (asset.update === 'auto') {
      modify.$unset[[key, assetKey].join('.')] = "true"
    }
  });

  var balances = ns.quantumCheck(address);
  if (balances[0] == 'error') return;
  print("balances", balances)

  _.each(balances, function(balance) {
    var asset = balance.asset;
    if (!asset) return

    var quantity; // = parseFloat (balance.quantity);
    try {
      quantity = parseFloat(balance.quantity)
    } catch (e) {
      quantity = balance.quantity;
    }

    var k = [key, asset].join(".");
    modify.$set[k] = {
      update: 'auto',
      quantity: quantity,
      asset: asset,
      updatedAt: new Date(),
    };
    delete modify.$unset[k];
  });

  if (_.isEmpty(modify.$unset)) delete(modify.$unset);

  // if modifier not empty
  if (_.keys(modify).length) {
    var k0 = [key0, accountKey, 'addresses', address, 'updatedAt'].join('.');
    modify.$set[k0] = new Date();
  }
  if (_.isEmpty(modify.$set)) delete(modify.$set);
  Meteor.users.update(sel, modify);
}

// depending on options - per single address or per account or per user
ns.updateBalances = function(options) { //todo: optimize
  check(options, Object);
  check(options.userId, String);

  var userId = options.userId;
  if (!userId) return;
  var accountKey = options.accountKey;
  var address = options.address;
  var isOwn = options.isOwn;
  var fields = ns.accountsFields(isOwn);
  if (!isOwn) _.extend(fields, {"services.balanceUpdate": 1});

  if (!accountKey || !address) {
    var accounts = Meteor.users.findOne({
      _id: userId
    }, {
      fields: fields
    }) || {};
  }

  if (!accountKey) {
    if (!isOwn) {
      var lastUpdate = accounts.services && accounts.services.balanceUpdate
        && accounts.services.balanceUpdate.updatedAt;
      if (lastUpdate && (new Date().valueOf() - lastUpdate.valueOf()) < 300000) { //5 minutes
        print("quitting mass balance update", "last was <5 minutes ago");
        return;
      } else {
        Meteor.users.update({_id: userId}, {$set: {
            "services.balanceUpdate.updatedAt": new Date()
          }
        });
      }
    }

    var accountKeys = _.keys(accounts['accounts'] || {});
    if (isOwn) accountKeys = _.union(accountKeys, _.keys(accounts['accountsPrivate'] || {}))
    _.each(accountKeys, function(ak) {
      ns.updateBalances({
        userId: userId,
        accountKey: ak,
        isOwn: isOwn
      })
    });
  } else {
    if (!address) {
      var key0 = CF.UserAssets.getAccountPrivacyType(userId, accountKey)
      var addresses = accounts[key0] && accounts[key0][accountKey] && accounts[key0][accountKey].addresses && _.keys(accounts[key0][accountKey].addresses)

      _.each(addresses, function(addr) {
        ns.updateBalance(userId, accountKey, addr, isOwn)
      });
      return
    } else { //proxy
      ns.updateBalance(userId, accountKey, address, isOwn)
      return
    }
  }
}
*/

checkAllowed = function(accountKey, userId){ // TODO move to collection rules
  if (!userId) return false;
  var account = CF.Accounts.collection.findOne({_id: accountKey, refId: userId});
  return account;
}

Meteor.methods({
  cfAssetsUpdateBalances: function(options) { //TODO move to CF.Accounts
    console.log(options);
    options = CF.Utils.normalizeOptionsPerUser(options);

    print("cfAssetsUpdateBalances was called with options", options, true)
    options.userId = options.userId || this.userId;
    options.private = options.userId == this.userId;
    if (!options.userId) return {
      error: "no userId passed"
    }
    this.unblock(); //? not sure this is what needed
    return CF.Accounts._updateBalances(options);
  },

  cfAssetsAddAddress: function(accountKey, address) {

    if (!checkAllowed(accountKey, this.userId)) return;

    var key = _k(["addresses", address]);
    var set = {
      $set: {}
    };
    set.$set[key] = {
      assets: {}
    };
    //push account to dictionary of accounts, so can use in autocomplete later
    CF.Accounts.collection.update({
      _id: accountKey
    }, set);

    Meteor.call("cfAssetsUpdateBalances", {
      accountKey: accountKey,
      address: address
    })
  },

  cfAssetsRemoveAddress: function(accountKey, asset) {
    if (!checkAllowed(accountKey, this.userId)) return;
    var sel = { _id: accountKey };
    var key = _k(["addresses", asset]);
    var unset = {
      $unset: {}
    };
    unset.$unset[key] = true;
    CF.Accounts.collection.update(sel, unset)
  },

  cfAssetsAddAccount: function(obj) {
    if (!this.userId) return {
      err: "no userid"
    };
    check(obj, Match.ObjectIncluding({
      isPublic: Boolean,
      name: String
    }));

    var user = Meteor.users.findOne({_id: this.userId});

    if (!CF.User.hasPublicAccess(user)) obj.isPublic = false;
    if (!ns.accountNameIsValid(obj.name, this.userId)) return {
      err: "invalid acc name"
    };

    var key = CF.Accounts.collection.insert ({
      name: obj.name,
      addresses: {},
      isPrivate: !obj.isPublic
    });

    if (obj.address) Meteor.call('cfAssetsAddAddress', key, obj.address);

    return {
      newAccountKey: key
    };
  },

  cfAssetsRenameAccount: function(accountKey, newName) {
    var account = checkAllowed(accountKey, this.userId)
    if (!account) return false;
    var sel = {
      _id: accountKey
    };

    var checkName = ns.accountNameIsValid(newName, this.userId, account.name);
    if (checkName) {
      var k = "name";
      var set = {  $set: {} };
      set.$set[k] = newName.toString();
      CF.Accounts.collection.update(sel, set);
    }
  },
  cfAssetsRemoveAccount: function(accountKey) {
    if (checkAllowed(accountKey, this.userId)) //todo - maybe direct,
        // not method (setup allow/deny for collection)
    CF.Accounts.collection.remove({_id: accountKey})
  },

  // manual set
  cfAssetsAddAsset: function(accountKey, address, asset, q) {
    if (!checkAllowed(accountKey, this.userId)) return;
    var sel = {_id: accountKey}
    var modify = { $set: {} };
    var key = _k(['addresses', address, 'assets', asset]);
    modify.$set[key] = {
      asset: asset,
      quantity: q,
      update: 'manual',
      updatedAt: new Date()
    };
    CF.Accounts.collection.update(sel, modify)
  },
  cfAssetsDeleteAsset: function(accountKey, address, asset) {
    if (!checkAllowed(accountKey, this.userId)) return
    var sel = {
      _id: accountKey
    };
    var modify = {
      $unset: {}
    };
    var key = _k(['addresses', address, 'assets', asset]);
    modify.$unset[key] = true;
    CF.Accounts.collection.update(sel, modify)
  },
  cfAssetsTogglePrivacy: function(accountKey, fromKey) {
    //{{! todo: add check if user is able using this feature}}

    if (!checkAllowed(accountKey, this.userId)) return false;

    var toKey = (fromKey == 'accounts' ? 'accountsPrivate' : 'accounts'); //TODO - remove strings, not needed
    var user = Meteor.users.findOne({
      _id: this.userId
    });
    if (!CF.User.hasPublicAccess(user)) toKey = 'accountsPrivate'

    logger.info("user " + this.userId + " ordered turning account " + account.name + " to " + toKey);

    CF.Accounts.collection.update({_id: accountKey}, toKey == 'accountsPrivate' ? {$set: {isPrivate: true}} :
      {$unset: {isPrivate: true}})
  }
});
