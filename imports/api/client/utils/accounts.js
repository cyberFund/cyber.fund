import Acounts from '/imports/api/collections/Acounts'
import {_k, normalizeOptionsPerUser} from '/imports/api/utils'
import {findByRefId} from '/imports/api/cf/accounts/utils'

var cfAccountsUtilsClient = {}
cfAccountsUtilsClient._importFromUser = function(userId) {
  var user = Meteor.users.findOne({
    _id: userId
  });
  if (!user) return;
  var accounts = user.accounts || {};
  var accountsPrivate = user.accountsPrivate || {};
  _.each(accounts, function(account, key) {
    var doc = {
      name: account.name,
      addresses: account.addresses,
      refId: userId,
      createdAt: new Date(),
      index: key // back compat. no need
    };
    Acounts.upsert({
      refId: userId,
      index: key // back compat. no need
    }, doc);
  });
  _.each(accountsPrivate, function(account, key) {
    var doc = {
      name: account.name,
      addresses: account.addresses,
      isPrivate: true,
      refId: userId,
      createdAt: new Date(),
      index: key // back compat. no need
    };
    Acounts.upsert({
      refId: userId,
      index: key // back compat. no need
    }, doc);
  });
};

var checkAllowed = function(accountKey, userId) { // TODO move to collection rules
  if (!userId) return false;
  var account = Acounts.findOne({
    _id: accountKey,
    refId: userId
  });
  return account;
};


// get auto balances per address


//

// per single address.
// todo: operate at account level?
// private should be set by server.
cfAccountsUtilsClient._updateBalanceAddress = function(accountIn, address) {
  var account = typeof accountIn === "string" ? Acounts.findOne({_id: accountIn}) : accountIn;
  var addressObj = account && account.addresses && account.addresses[address];
  var modify = {
    $set: {},
    $unset: {}
  };

  if (!account || !addressObj) {
  //  print("no account or address object; account", account, true);
  //  print("address", address);
    return;
  }

  var balances = cfClientAccountUtils.quantumCheck(address);
  if (balances[0] == "error") return;

  var key = _k(["addresses", address, "assets"]);

  _.each(addressObj.assets, function(asset, assetKey) {
    if (asset.update === "auto") {
      modify.$unset[_k([key, assetKey])] = "true";
    }
  });

  //print("balances", balances)

  _.each(balances, function(balance) {
    if (!balance.asset) return;

    var k = _k([key, balance.asset]);
    modify.$set[k] = {
      update: "auto",
      quantity: balance.quantity
    /*  vBtc: balance.vBtc,
      vUsd: balance.vUsd, */
    };
    delete modify.$unset[k];
  });

  if (_.isEmpty(modify.$unset)) delete(modify.$unset);
  if (_.isEmpty(modify.$set)) delete(modify.$set);
  if (_.keys(modify).length) {
    modify.$set[_k(["addresses", address, "updatedAt"])] = new Date();
    Acounts.update({
      _id: account._id
    }, modify);
  }
  //TODO: updateAddressBalance(account._id, address);
  // then updateAccountBalance(account._id)
};





// autoupdate balances.
// 1. userId passed - do for all accounts
// 2. accountKey passed - do for that accountKey (use userId too.)
cfAccountsUtilsClient._updateBalances = function(options) { //todo: optimize
  check(options, Object);

  var refId = options.refId;
  var accountKey = options.accountKey;
  var address = options.address;
  var private = options.private;

  var selector = {};
  if (options.refId) _.extend(selector, {
    refId: refId
  });
  if (options.accountKey) _.extend(selector, {
    _id: accountKey
  });

  Acounts.find(selector).forEach(function(account) {
    cfClientAccountUtils._updateBalanceAccount(account, options);
  });
};
cfAccountsUtilsClient.privateToString = function(private){ return private ? 'private': 'public'};

cfAccountsUtilsClient.addressExists = function (address, refId) {
  if (!refId) return false;
  var accounts = findByRefId(refId, {private:true});
  var addresses = _.flatten(_.map(accounts.fetch(), function (account) {
    return _.map(account.addresses, function (v, k) {
      return k;
    })
  }));
  return addresses.indexOf(address) > -1
};

module.exports = cfAccountsUtilsClient
