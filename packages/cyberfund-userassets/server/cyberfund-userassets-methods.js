var ns = CF.UserAssets;
var nsn = "CF.UserAssets."

//
ns .quantumCheck = function(address) {
  var r = HTTP.call("GET", "http://quantum.cyber.fund:3001?address="+address);
  if (r.statusCode == 200)
    return r.data;
  return [];
}

// per single address
ns .updateBalance = function(userId, accountKey, address){
  var print = CF.Utils.logger.print;
  if (! userId || !accountKey || !address) {
    console.log (nsn+"updateBalance: missing arguments. ",
      [userId, accountKey, address].join("; "))
    return;
  }

  var key0 = ns.getAccountPrivacyType(userId, accountKey);
  if (!key0) return;

  var isOwn = userId === Meteor.userId();
  if (key0 == 'accountsPrivate' && !isOwn) return;

  var sel = {_id: userId};
  var accounts = Meteor.users.findOne(sel,
    {fields: ns.accountsFields(isOwn)}) || {};
  accounts = accounts[key0] || {}

  var addressObj = accounts[accountKey] && accounts[accountKey].addresses
    && accounts[accountKey].addresses[address];
  if (!addressObj) {
    print ("no address obj", true);
    print ("accounts", accounts, true);
    print ("address", address)

    return;
  }

  var modify = {$set: {}, $unset: {}};

  var key = [key0, accountKey, 'addresses', address, 'assets'].join(".");
  _.each(addressObj.assets, function (asset, assetKey) {
    if (asset.update === 'auto') {
      modify.$unset[[key, assetKey].join('.')] = "true"
    }
  });

  var balances = ns.quantumCheck(address);

  print("address", address, true)
  print("balances", balances)

  if (!balances || !balances.length) return;
  _.each(balances, function(balance){
    var asset = balance.asset;
    if (!asset) return

    var quantity;// = parseFloat (balance.quantity);
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
ns .updateBalances = function(options){
  check(options, Object);
  check(options.userId, String);

  var userId = options.userId;                           if (! userId) return;
  var isOwn = userId === Meteor.userId();
  var accountTypes = isOwn ? ['accounts', 'accountsPrivate'] : ['accounts'];
  //var fields =

  var accountKey = options.accountKey;
  var address = options.address;


  /*  var fields = {};
    fields[key0] = 1;
    var sel = {_id: userId};
    var accounts = Meteor.users.findOne(sel, {fields: fields})[key0] || {};
    */

  if (!accountKey || !address) {
    var accounts = Meteor.users.findOne({_id: userId},
      {fields: ns.accountsFields(isOwn)}) || {};
  }

  if (!accountKey) {
    // get accounts object, call per every account with its key
    console.log("LALALALALA") // check all public or all if own
  }
  else {
    if (!address) {
      var key0 = CF.UserAssets. getAccountPrivacyType(userId, accountKey)
      var addresses = accounts[key0] && accounts[key0].addresses
      && _.keys(accounts[key0].addresses)
      console.log(addresses);
    }
    else {
      return ns.updateBalance( userId, accountKey, address)
    }
  }

}

Meteor.methods({
  quantumCheck: function(address){  //remove?
    check(address, String);
    return ns.quantumCheck(address);
  },

  cfAssetsUpdateBalances: function (options) {
    options.userId = options.userId || this.userId;
    if (!options.userId) return {error: "no userId passed"}
    return ns.updateBalances(options);
  },

  cfAssetsAddAddress: function (accountKey, address) {
    //decide what to update
    var userId = this.userId;
    if (!this.userId) return;
    var key0 = ns.getAccountPrivacyType(userId, accountKey);
    if (!key0) return;
    var key = [key0, accountKey, "addresses", address].join(".");
    var set = {$set: {}};
    set.$set[key] = {assets: {}};
    //push account to dictionary of accounts, so can use in autocomplete later
    Meteor.users.update({_id: userId}, set);
    Meteor.call("cfAssetsUpdateBalances", {accountKey: accountKey, address: address})
  },

  cfAssetsRemoveAddress: function (accountKey, asset) {
    var userId = this.userId;
    if (!userId) return;

    var key0 = ns.getAccountPrivacyType(userId, accountKey);
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

    if (!ns.accountNameIsValid(obj.name, user[key0])) return {err: "invalid acc name"};

    // find next account #
    var key = ns.nextKey(_.extend(user.accounts || {}, privates));
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
    var key0 = ns.getAccountPrivacyType(this.userId, accountKey);
    if (!key0) return;

    var accounts = Meteor.users.findOne(sel)[key0];
    if (!accounts || !accounts[accountKey]) {
      return;
    }
    var checkName = ns.accountNameIsValid(newName, accounts, accounts[accountKey].name);
    if (checkName) {
      var k = [key0, accountKey, "name"].join('.');
      var set = {$set: {}};
      set.$set[k] = newName;
      Meteor.users.update(sel, set);
    }
  },
  cfAssetsRemoveAccount: function (accountKey) {
    if (!this.userId) return;
    var key0 = ns.getAccountPrivacyType(this.userId, accountKey);
    if (!key0) return;
    var k = [key0, accountKey].join('.');
    var unset = {$unset: {}};
    unset.$unset[k] = true;
    Meteor.users.update({_id: this.userId}, unset);
  },

  cfAssetsAddAsset: function (accountKey, address, asset, q) {
    if (!this.userId) return;
    var key0 = ns.getAccountPrivacyType(this.userId, accountKey);
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
    var key0 = ns.getAccountPrivacyType(this.userId, accountKey);
    if (!key0) return;
    var sel = {_id: this.userId};
    var modify = {$unset: {}};
    var key = [key0, accountKey, 'addresses', address, 'assets', asset].join(".");
    modify.$unset[key] = true;
    Meteor.users.update(sel, modify)
  },
  cfAssetsTogglePrivacy: function (accountKey, fromKey) {

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
