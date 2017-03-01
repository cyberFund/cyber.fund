import {AccountsHistory, Acounts} from '/imports/api/collections'
import {_k} from '/imports/api/utils'

var cfAccountsUtils = {}

//import {findById, extractAssets} from '/imports/api/cf/account/utils'


// mutates asset
function setValues(asset, assetId) {
  var prices = CF.CurrentData.getPricesById(assetId) || {};

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
