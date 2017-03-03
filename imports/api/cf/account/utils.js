import {AccountsHistory} from '/imports/api/collections'
import Acounts from '/imports/api/collections/Acounts'
import {_k} from '/imports/api/utils'
import {getPricesById} from '/imports/api/currentData'
var cfAccountsUtils = {}

//import {findById, extractAssets} from '/imports/api/cf/accounts/utils'


// mutates asset
function setValues(asset, assetId) {
  var prices = getPricesById(assetId) || {};

  asset.vUsd = (prices.usd || 0) * (asset.quantity || 0);
  asset.vBtc = (prices.btc || 0) * (asset.quantity || 0);
}

cfAccountsUtils._setValues = setValues;

cfAccountsUtils.findByRefId = function(userId, options) {
  var selector = {
    refId: userId
  };

  // have to supply isPrivate flag internally on server
  if (Meteor.isServer && !options.private) _.extend(selector, {
    isPrivate: {
      $ne: true
    }
  });
  return Acounts.find(selector);
};

// is version of _updateBalanceAddress, aims to operate at account level (less writes to db)
cfAccountsUtils._updateBalanceAccount = function(accountIn, options) {

  var modify = {
    $set: {},
    $unset: {}
  };
  var account = typeof accountIn === "string" ? Acounts.findOne({_id: accountIn}) : accountIn;

  if (!account || !account.addresses) {
  //  print("no account or addresses on it", account, true);
  }

  if (!options.private) {
    var lastUpdate = account.updatedAt;
    if (lastUpdate && (new Date().valueOf() - lastUpdate.valueOf()) < 300000) { //5 minutes
      return account._id;
    }
  }
  _.each(account.addresses, function(addressObj, address) {
    var balances = cfClientAccountUtils.quantumCheck(address);
    var key = _k(["addresses", address, "assets"]);

    // if balance checker is ok
    if (balances[0] !== "error") {
      _.each(addressObj.assets, function(asset, assetKey) {
        if (asset.update === "auto") {
          modify.$unset[_k([key, assetKey])] = true;
        }
      });
      _.each(balances, function(balance) {
        if (!balance.asset) return;

        var k = _k([key, balance.asset]);
        modify.$set[k] = {
          update: "auto",
          quantity: balance.quantity
        };
        delete modify.$unset[k];
        modify.$set[_k(["addresses", address, "updatedAt"])] = new Date();
      });
    }
  });


  if (_.isEmpty(modify.$unset)) delete(modify.$unset);
  if (_.isEmpty(modify.$set)) delete(modify.$set);

  if (!_.isEmpty(modify)) {
    modify.$set[_k(["updatedAt"])] = new Date();
    Acounts.update({
      _id: account._id
    }, modify);
  }
  return account._id;
};

cfAccountsUtils.findById = function(_id, options) {
  if (!_id) return {};
  options = options || {};
  var selector = {
    _id: _id
  };
    //if (Meteor.isServer) {} && !options.private)
    //  _.extend (selector, {isPrivate: {$ne: true}})
  return Acounts.findOne(selector);
};

var checkAllowed = function(accountKey, userId) { // TODO move to collection rules
  if (!userId) return false;
  var account = Acounts.findOne({
    _id: accountKey,
    refId: userId
  });
  return account;
};

cfAccountsUtils.accumulate = function(docs, accumulator){
  var ret = accumulator || {};
  docs.forEach(function(doc){
    _.each(doc, function(asset, assetId){
      if (ret[assetId]) {
        ret[assetId].quantity += asset.quantity || 0;
        ret[assetId].vUsd += asset.vUsd || 0;
        ret[assetId].vBtc += asset.vBtc || 0;
      }
      else ret[assetId] = {
        quantity: asset.quantity || 0,
        vUsd: asset.vUsd || 0,
        vBtc: asset.vBtc || 0
      };
    });
  });
  return ret;
};

cfAccountsUtils.extractAssets = function flatten(doc) {
  var ret = [];
  if (doc.addresses) {
    _.each(doc.addresses, function(assetsDoc, address) {
      if (assetsDoc.assets) {
        ret.push(assetsDoc.assets);
      }
    });
  }
  return cfAccountsUtils.accumulate(ret);
};


cfAccountsUtils.accountNameIsValid = function(name, refId, oldName) {
  if (!name || !_.isString(name)) return false;
  if (oldName && (name === oldName) || !refId) return true;
  var ret = true;
  Acounts.find({
    refId: refId
  }).forEach(function(account) {
    if (name == account.name) ret = false;
  });
  return ret;
};

module.exports = cfAccountsUtils
