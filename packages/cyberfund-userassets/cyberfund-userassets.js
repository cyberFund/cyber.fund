CF.UserAssets = {};
CF.UserAssets.accountNameIsValid = function(name, accounts, oldName){
  if (!name || !_.isString(name)) return false;
  if (oldName && name == oldName) return true;
  var ret = true;
  _.each(accounts, function(account){
    if (name == account.name) ret = false;
  })
  return ret;
};

CF.UserAssets.nextKey = function(accounts){
  var keys = _.keys(accounts || {});
  if (!keys.length) return 1;
  _.each(keys, function(v, k){
    if (_.isString(v)) keys[k] = parseInt(v);
  });
  return _.max(keys) + 1;
};

/**
 *
 * @param assetsObject - part of user document
 * in which accounts information is stored
 * @returns {Array} of token symbols
 */

CF.UserAssets.getSystemsFromAccountsObject = function(assetsObject) {
  if (!assetsObject) return [];
  var systems = _.values(assetsObject);
  if (systems) {
    systems = _.flatten(_.map(systems, function (account) {
      return _.values(account.addresses)
    }));
  } else return [];
  if (systems) {
    systems = _.uniq(_.flatten(_.map(systems, function (address) {
      return (_.keys(address.assets))
    })));
  } else return [];
  return _.uniq(systems);
}

CF.UserAssets.getQuantitiesFromAccountsObject = function(accountsObject, key) {
  var sum = 0.0;
  if (!accountsObject) {
    return sum;
  }
  if (!key) {
    return sum;
  }
  var rets =  _.values(accountsObject);
  if (rets) {
    rets = _.flatten(_.map(rets, function (account) {
      return _.values(account.addresses)
    }));
  } else return sum;

  _.each(rets, function(assetsObject){
    assetsObject = assetsObject.assets;
    if (assetsObject[key]) {
      if (assetsObject[key].asset == key/*why we need this check?*/ && assetsObject[key].quantity) sum+= assetsObject[key].quantity
    }
  });

  return sum;
}