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