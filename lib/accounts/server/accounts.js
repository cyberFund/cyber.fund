//todo factor out
function _k(array){
  return array.join('.');
}

var print = CF.Utils.logger.print;
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
      index: key, // back compat. no need
    }
    ns.collection.upsert({
      refId: userId,
      index: key // back compat. no need
    }, doc);
  });
}

Meteor.methods({
  importAccounts: function(){
    Meteor.users.find({}, {fields: {_id: 1}}).forEach(function(user){
      console.log(user._id);
      ns._importFromUser(user._id);
    });
  }
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
ns._updateBalanceAddress = function(_id, address, private) {
  if (!_id || !address) {
    print("updateBalanceAddress: missing arguments", [_id, address].join("; "))
    return;
  }

  var account = ns.findById({_id: id, private: private})
  if (!account) return;

  var addressObj = account && account.addresses && account.addresses[address];
  if (!addressObj) {
    print("no address obj", true, true);print("account", account, true);
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
    var asset = balance.asset;
    if (!asset) return

    var quantity;
    try {
      quantity = parseFloat(balance.quantity)
    } catch (e) {
      quantity = balance.quantity;
    }

    var k = _k([key, asset]);
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
    modify.$set[_k(['addresses', address, 'updatedAt'])] = new Date();
  }
  if (_.isEmpty(modify.$set)) delete(modify.$set);
  ns.collection.update(sel, modify);
}

ns._updateBalanceAccount = function(_id, private) {
  if (!_id ) {
    print("updateBalanceAccount: missing argument", _id)
    return;
  }

  var account = ns.findById({_id: id, private: private})
  if (!account) return;

  var addressesObj = account && account.addresses ;//&& account.addresses[address];
  if (!addressesObj) {
    print("no address obj", true, true);print("account", account, true);
    print("address", address);return;
  }

  var modify = {$set: {},$unset: {}};
  _.each (addressesObj, function(addressObj, address){
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
      if (!asset) return

      var quantity;
      try {
        quantity = parseFloat(balance.quantity)
      } catch (e) {
        quantity = balance.quantity;
      }

      var k = _k([key, asset]);
      modify.$set[k] = {
        update: 'auto',
        quantity: quantity,
        asset: asset,
        updatedAt: new Date(),
      };
      delete modify.$unset[k];
    });
  })

  if (_.isEmpty(modify.$unset)) delete(modify.$unset);

  // if modifier not empty
  if (_.keys(modify).length) {
    modify.$set[_k(['addresses', address, 'updatedAt'])] = new Date();
  }
  if (_.isEmpty(modify.$set)) delete(modify.$set);
  ns.collection.update(sel, modify);
}
