var ns = CF.Accounts;

function getPricesFromCD(doc){
  return doc && doc.metrics && doc.metrics.price && _.clone(doc.metrics.price) || null;
}

function setValues (asset, assetId) {
  if (asset.quantity) {
    var prices = getPricesFromCD(CurrentData.findOne({_id: assetId}, {fields: {"metrics.price": 1}}));
    if (prices) {
      if (prices.eth && !prices.btc) {
        var priceEth = getPricesFromCD(CurrentData.findOne({_id: 'Ethereum'}, {fields: {"metrics.price": 1}}));
        if (priceEth) {
          prices.btc = prices.eth * priceEth.btc;
          prices.usd = prices.eth * priceEth.usd;
        }
        // todo: asset.vEth = prices.usd*asset.quantity;
      }
      if (prices.usd) asset.vUsd = prices.usd*asset.quantity;
      if (prices.btc) asset.vBtc = prices.btc*asset.quantity;
    }
  }
}

ns.collection = new Meteor.Collection('accounts', {
  transform: function(doc){
    if (doc.addresses) {
      var accBtc = 0;
      var accUsd = 0;
      _.each(doc.addresses, function (assetsDoc, address) {
        var addrUsd = 0; var addrBtc = 0;
        if (assetsDoc.assets) {
          _.each (assetsDoc.assets, function(asset, assetId){
            setValues (asset, assetId);
            addrUsd += asset.vUsd;
            addrBtc += asset.vBtc;
          });
        }
        assetsDoc.vUsd = addrUsd;
        assetsDoc.vBtc = addrBtc;
        accBtc += addrBtc;
        accUsd += addrUsd;
      });
      doc.vBtc = accBtc;
      doc.vUsd = accUsd;
    }
    return doc;
  }
});
var print = Meteor.isClient ? function(){} : CF.Utils.logger.getLogger('CF.Accounts').print;
var _k = CF.Utils._k

ns.collection.allow({
  insert: function(userId, doc){
    return userId && (doc.refId == userId);
  },
  update: function(userId, doc, fieldNames, modifier){
    if (fieldNames['refId'] || fieldNames['value'] || fieldNames['createdAt']) return false;
    if (doc.refId != userId) return false;
    return true;
  },
  remove: function(userId, doc){
    return doc.refId == userId;
  }
});

ns._findByUserId = function(userId, options){
  var selector = {
    refId: userId,
  }

  // have to supply isPrivate flag internally on server
  if (Meteor.isServer && !options.private) _.extend (selector, {isPrivate: {$ne: true}})
  return ns.collection.find(selector);
}

ns.findById = function(_id, options){
  if (!_id) return {};
  options = options || {};
  var selector = {_id: _id}
  //if (Meteor.isServer) {} && !options.private)
  //  _.extend (selector, {isPrivate: {$ne: true}})
  return ns.collection.findOne(selector);
}

var checkAllowed = function(accountKey, userId){ // TODO move to collection rules
  if (!userId) return false;
  var account = CF.Accounts.collection.findOne({_id: accountKey, refId: userId});
  return account;
}

Meteor.methods({
  cfAssetsAddAccount: function(obj) {
    if (!this.userId) return {
      err: "no userid"
    };
    print("in add account", obj)
    check(obj, Match.ObjectIncluding({
      isPublic: Boolean,
      name: String
    }));

    var user = Meteor.users.findOne({_id: this.userId});
    if (!user) return;
    if (!CF.User.hasPublicAccess(user)) obj.isPublic = false;
    if (!ns.accountNameIsValid(obj.name, this.userId)) return {
      err: "invalid acc name"
    };

    var key = CF.Accounts.collection.insert ({
      name: obj.name,
      addresses: {},
      isPrivate: !obj.isPublic,
      refId: user._id
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
  cfAssetsTogglePrivacy: function(accountKey, fromKey) {
    //{{! todo: add check if user is able using this feature}}

    if (!checkAllowed(accountKey, this.userId)) return false;

    var user = Meteor.users.findOne({
      _id: this.userId
    });
    var account = CF.Accounts.findById(accountKey);
    if (account) {
      print ("account", account);
    }
    var toKey = (fromKey == 'accounts' ? 'accountsPrivate' : 'accounts'); //TODO - remove strings, not needed
    if (!CF.User.hasPublicAccess(user)) toKey = 'accountsPrivate'


    if (account.refId == this.userId) {
      print("user " + this.userId + " ordered turning account " + account.name + " to", toKey);

      CF.Accounts.collection.update({_id: accountKey}, {$set: {isPrivate: (toKey == 'accountsPrivate')}})
    }
  },

  cfAssetsRemoveAccount: function(accountKey) {
    if (checkAllowed(accountKey, this.userId)) //todo - maybe direct,
        // not method (setup allow/deny for collection)
    CF.Accounts.collection.remove({_id: accountKey})
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
      username: Meteor.user() && Meteor.user().username,
      accountKey: accountKey,
      address: address
    })
  }
})
