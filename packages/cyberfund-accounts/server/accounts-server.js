var _k = CF.Utils._k;
var ns = CF.Accounts;

ns.collection._ensureIndex({
  refId: 1
});

ns._importFromUser = function(userId) {
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
    ns.collection.upsert({
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
    ns.collection.upsert({
      refId: userId,
      index: key // back compat. no need
    }, doc);
  });
};

var checkAllowed = function(accountKey, userId) { // TODO move to collection rules
  if (!userId) return false;
  var account = CF.Accounts.collection.findOne({
    _id: accountKey,
    refId: userId
  });
  return account;
};

Meteor.methods({
  importAccounts: function(sel) {
    var user = Meteor.user();
    if (!user) return;
    if (!user.hasSuperPowers) sel = {
      _id: this.userId
    };
    return;
    Meteor.users.find(sel || {
      _id: "ErwxCME6azQS7KcNm"
    }, {
      fields: {
        _id: 1
      }
    }).forEach(function(user) {
      console.log(user._id);
      ns._importFromUser(user._id);
    });
  },

  // autoupdate balances for user
  cfAssetsUpdateBalances: function(options) {
    options = CF.Utils.normalizeOptionsPerUser(options);

    //print("cfAssetsUpdateBalances was called with options", options, true);
    options.refId = options.userId || this.userId;
    options.private = options.userId == this.userId;
    if (!options.userId && !options.accountKey) return {
      error: "neither userId nor accountKey passed"
    };
      //this.unblock(); //? not sure this is what needed
    Meteor.defer(function() {
      return ns._updateBalances(options);
    });
    return true;
  },
  checkBalance: function(address) {
    return ns.quantumCheck(address.toString());
  },
  // manual set
  cfAssetsAddAsset: function(accountKey, address, asset, q) {
    if (typeof q == "string") try {
      q = parseFloat(q);
    } catch (e) {
      return;
    }
    if (!checkAllowed(accountKey, this.userId)) return;
    var sel = {
      _id: accountKey
    };
    var modify = {
      $set: {}
    };
    var key = _k(["addresses", address, "assets", asset]);

    modify.$set[key] = {
      quantity: q,
      update: "manual",
      updatedAt: new Date()
    };

    CF.Accounts.collection.update(sel, modify);
    ns._updateBalanceAccount(CF.Accounts.collection.findOne(sel), {
      private: true
    });
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
    CF.Accounts.collection.update(sel, unset);
    ns._updateBalanceAccount(CF.Accounts.collection.findOne(sel), {
      private: true
    });
  },

  cfAssetsDeleteAsset: function(accountKey, address, asset) {
    if (!checkAllowed(accountKey, this.userId)) return;
    var sel = {
      _id: accountKey
    };
    var modify = {
      $unset: {}
    };
    var key = _k(["addresses", address, "assets", asset]);
    modify.$unset[key] = true;
    CF.Accounts.collection.update(sel, modify);
    ns._updateBalanceAccount(CF.Accounts.collection.findOne(sel), {
      private: true
    });
  }
});

// get auto balances per address
ns.quantumCheck = function(address) {
  function transform(data) {
    _.each(data, function(asset) {
      if (typeof asset.quantity == "string")
        asset.quantity = parseFloat(asset.quantity);
    });
    return data;
  }

  try {
    var r = HTTP.call("GET", "http://quantum.cyber.fund:3001?address=" + address);
    if (r.statusCode == 200) {
      return transform(r.data);
    } else {
      return ["error", {
        statusCode: r.statusCode
      }];
    }
  } catch (e) {
    return ["error", {
      statusCode: e.response && e.response.statusCode
    }];
  }
};

//

// per single address.
// todo: operate at account level?
// private should be set by server.
ns._updateBalanceAddress = function(accountIn, address) {
  var account = typeof accountIn === "string" ? CF.Accounts.collection.findOne({_id: accountIn}) : accountIn;
  var addressObj = account && account.addresses && account.addresses[address];
  var modify = {
    $set: {},
    $unset: {}
  };

  if (!account || !addressObj) return;

  var balances = ns.quantumCheck(address);
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
    ns.collection.update({
      _id: account._id
    }, modify);
  }
  //TODO: updateAddressBalance(account._id, address);
  // then updateAccountBalance(account._id)
};


// is version of _updateBalanceAddress, aims to operate at account level (less writes to db)
ns._updateBalanceAccount = function(accountIn, options) {

  var modify = {
    $set: {},
    $unset: {}
  };
  var account = typeof accountIn === "string" ? CF.Accounts.collection.findOne({_id: accountIn}) : accountIn;

  if (!account || !account.addresses) {
    print("no account or addresses on it", account, true);
  }

  if (!options.private) {
    var lastUpdate = account.updatedAt;
    if (lastUpdate && (new Date().valueOf() - lastUpdate.valueOf()) < 300000) { //5 minutes
      return account._id;
    }
  }
  _.each(account.addresses, function(addressObj, address) {
    var balances = ns.quantumCheck(address);
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
    ns.collection.update({
      _id: account._id
    }, modify);
  }
  return account._id;
};


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
  if (options.refId) _.extend(selector, {
    refId: refId
  });
  if (options.accountKey) _.extend(selector, {
    _id: accountKey
  });

  CF.Accounts.collection.find(selector).forEach(function(account) {
    ns._updateBalanceAccount(account, options);
  });
};
