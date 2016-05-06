var _k = CF.Utils._k
var print = CF.Utils.logger.getLogger('CF.Accounts').print;
var ns = CF.Accounts;
ns.collection._ensureIndex({refId: 1});

ns._importFromUser = function (userId){
  var user = Meteor.users.findOne({_id: userId});
  if (!user) return;
  var accounts = user.accounts || {};
  var accountsPrivate = user.accountsPrivate || {};
  _.each (accounts, function(account, key){
    var doc = {
      name: account.name,
      addresses: account.addresses,
      refId: userId,
      createdAt: new Date(),
      index: key // back compat. no need
    }
    ns.collection.upsert({
      refId: userId,
      index: key // back compat. no need
    }, doc);
  });
  _.each (accountsPrivate, function(account, key){
    var doc = {
      name: account.name,
      addresses: account.addresses,
      isPrivate: true,
      refId: userId,
      createdAt: new Date(),
      index: key, // back compat. no need
    }
    ns.collection.upsert({
      refId: userId,
      index: key // back compat. no need
    }, doc);
  });
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
      accountKey: accountKey,
      address: address
    })
  },

  cfAssetsRemoveAddress: function(accountKey, asset) {
    if (!checkAllowed(accountKey, this.userId)) return;
    if (!asset) return;
    var sel = { _id: accountKey };
    var key = _k(["addresses", asset]);
    var unset = {
      $unset: {}
    };
    unset.$unset[key] = true;
    CF.Accounts.collection.update(sel, unset)
  },

  // manual set
  cfAssetsAddAsset: function(accountKey, address, asset, q) {
    if (typeof q == 'string') try {
      q = parseFloat(q);
    } catch(e) {
      return;
    }
    if (!checkAllowed(accountKey, this.userId)) return;
    var sel = {_id: accountKey}
    var modify = { $set: {} };
    var key = _k(['addresses', address, 'assets', asset]);
    modify.$set[key] = {
      //asset: asset,
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


})


Meteor.methods({
  importAccounts: function(sel){
    var user = Meteor.user();
    if (!user) return;
    if (!user.hasSuperPowers) sel = {_id: this.userId};
    Meteor.users.find(sel||{_id: "ErwxCME6azQS7KcNm"}, {fields: {_id: 1}}).forEach(function(user){
      console.log(user._id);
      ns._importFromUser(user._id);
    });
  },

  // autoupdate balances for user
  cfAssetsUpdateBalances: function(options) {
    options = CF.Utils.normalizeOptionsPerUser(options);

    print("cfAssetsUpdateBalances was called with options", options, true)
    options.refId = options.userId || this.userId;
    options.private = options.userId == this.userId;
    if (!options.userId && !options.accountKey) return {
      error: "neither userId nor accountKey passed"
    }
    this.unblock(); //? not sure this is what needed
    return ns._updateBalances(options);
  },
})


// get auto balances per address
ns.quantumCheck = function(address) {
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

//

// per single address.
// todo: operate at account level?
// private should be set by server.
ns._updateBalanceAddress = function(account, address) {
  var addressObj = account && account.addresses && account.addresses[address];
  if (!account || !addressObj) {
    print("no account or address object; account", account, true);
    print("address", address);return;
  }

  var modify = {$set: {},$unset: {}};

  var key = _k(['addresses', address, 'assets']);
  _.each(addressObj.assets, function(asset, assetKey) {
    if (asset.update === 'auto') {
      modify.$unset[_k([key, assetKey])] = "true"
    }
  });

  var balances = ns.quantumCheck(address);
  if (balances[0] == 'error') return;
  print("balances", balances)

  _.each(balances, function(balance) {
    var asset = balance.asset
    if (!asset) {
      print("NO BALANCE", balance, true)
      print ("NO KEY", asset)
      return;
    } else { print ("ok ok", "ok")}

    var quantity;
    try {
      quantity = parseFloat(balance.quantity)
    } catch (e) {
      print ("catched non-string balance at", _k([account._id, address, asset]) )
      quantity = balance.quantity;
      if (typeof quantity != 'number') return;
    }

    var k = _k([key, asset]);
    modify.$set[k] = {
      update: 'auto',
      quantity: quantity,
      //asset: asset,
      updatedAt: new Date(),
    };
    delete modify.$unset[k];
  });
  if (_.isEmpty(modify.$unset)) delete(modify.$unset);
  if (_.isEmpty(modify.$set)) delete(modify.$set);
  if (_.keys(modify).length) {
    modify.$set[_k(['addresses', address, 'updatedAt'])] = new Date();
  }
  ns.collection.update({_id: account._id}, modify);
}


// is version of _updateBalanceAddress, aims to operate at account level (less writes to db)
// ==========   NOT TESTED !   ====================
ns._updateBalanceAccount = function(account) {

  if (!account) {
    print("no account", account, true);
    print("address", address);return;
  }
  print("account", account);
  if (!account.addresses) return;
  var modify = {$set: {},$unset: {}};
  _.each(account.addresses, function(addressObj, address){
    //var addressObj = account && account.addresses && account.addresses[address];
    var key = _k(['addresses', address, 'assets']);
    _.each(addressObj.assets, function(asset, assetKey) {
      if (asset.update === 'auto') {
        modify.$unset[_k([key, assetKey])] = "true"
      }
    });

    var balances = ns.quantumCheck(address);
    if (balances[0] == 'error') return;
    print("balances", balances)

    _.each(balances, function(balance) {
      var asset = balance.asset;
      if (!asset) return;

      var quantity;
      try {
        quantity = parseFloat(balance.quantity)
      } catch (e) {
        print ("catched non-string balance at", _k([account._id, address, key]) )
        quantity = balance.quantity;
        if (typeof quantity != 'number') return;
      }

      var k = _k([key, asset]);
      modify.$set[k] = {
        update: 'auto',
        quantity: quantity,
        //asset: asset,
        updatedAt: new Date(),
      };
      delete modify.$unset[k];
    });

    if (_.keys(modify).length) {
      modify.$set[_k(['addresses', address, 'updatedAt'])] = new Date();
    }
  });

  if (_.isEmpty(modify.$unset)) delete(modify.$unset);
  if (_.isEmpty(modify.$set)) delete(modify.$set);

  if (!_.isEmpty(modify)){
    modify.$set[_k(['updatedAt'])] = new Date();
    ns.collection.update({_id: account._id}, modify);
  }
}

// autoupdate balances.
// 1. userId passed - do for all accounts
// 2. accountKey passed - do for that accountKey (use userId too.)
ns._updateBalances = function(options) { //todo: optimize
  check(options, Object);

  var refId = options.refId;
  var accountKey = options.accountKey;
  var address = options.address;
  var private = options.private;

  var selector = {};
  if (options.refId) _.extend (selector, {refId: refId})
  if (options.accountKey) _.extend (selector, {_id: accountKey});
  //if (!options.private) _.extend (selector, {isPrivate: {$ne: true}});

  if (address) {
    if (!options.refId) return;
    console.log(111)
    console.log(selector);
    var account = CF.Accounts.collection.findOne(selector);
    console.log(account);
    ns._updateBalanceAddress(account, address);
  } else {
    CF.Accounts.collection.find(selector).forEach(function(account){
      ns._updateBalanceAccount(account);
    });
  }


  if (!accountKey) { //TODO  put rate limiter back. now testing..
    if (!private) {/* rate limiter
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
      }*/
    }
  }
}
