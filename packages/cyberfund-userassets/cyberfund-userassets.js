CF.UserAssets = {};
CF.UserAssets.accountNameIsValid = function (name, accounts, oldName) {
  if (!name || !_.isString(name)) return false;
  if (oldName && name == oldName) return true;
  var ret = true;
  _.each(accounts, function (account) {
    if (name == account.name) ret = false;
  });
  return ret;
};

CF.UserAssets.nextKey = function (accounts) {
  var keys = _.keys(accounts || {});
  if (!keys.length) return 1;
  _.each(keys, function (v, k) {
    if (_.isString(v)) keys[k] = parseInt(v);
  });
  return (_.max(keys) + 1).toString();
};

/**
 *
 * @param assetsObject - part of user document
 * in which accounts information is stored
 * @returns {Array} of system names
 */

CF.UserAssets.getSystemsFromAccountsObject = function (assetsObject) {
  if (!assetsObject) return [];
  var systems = _.values(assetsObject);
  if (systems) {
    systems = _.flatten(_.map(systems, function (account) {
      return _.values(account.addresses)
    }));
  } else {
    return [];
  }
  if (systems) {
    systems = _.uniq(_.flatten(_.map(systems, function (address) {
      return (_.keys(address.assets))
    })));
  } else {
    return [];
  }
  return _.uniq(systems);
};

/**
 * return quantity of specified coins in specified addressesObject
 * @param addressesObject - addresses object provided
 * @param key - system name to check against
 * @returns {number} quantity of specified coins from accountsObject
 *
 * same as getQuantitiesFromAccountsObject - but to work account-wise, not totaling..
 */
CF.UserAssets.getQuantitiesFromAddressesObject = function (addressesObject, key) {
  var sum = 0.0;
  if (addressesObject && key) {
    var rets = _.values(addressesObject);
    _.each(rets, function (assetsObject) {
      assetsObject = assetsObject.assets;
      if (assetsObject[key]) {
        if (assetsObject[key].asset == key/*why we need this check?*/ && assetsObject[key].quantity) sum += assetsObject[key].quantity
      }
    });
  }

  return sum;
};

/**
 * return quantity of specified coins in specified accountsObject
 * @param accountsObject - accounts object provided
 * @param key - system name to check against (or system object)
 * @returns {number} quantity of specified coins from accountsObject
 */
CF.UserAssets.getQuantitiesFromAccountsObject = function (accountsObject, key) {
  var sum = 0.0;
  if (_.isObject(key) && _.isString(key.system)) key = key.system;
  if (accountsObject && key) {
    var rets = _.values(accountsObject);
    if (rets) {
      rets = _.flatten(_.map(rets, function (account) {
        return _.values(account.addresses)
      }));
    } else {
      return sum;
    }

    _.each(rets, function (assetsObject) {
      assetsObject = assetsObject.assets;
      if (assetsObject[key]) {
        if (assetsObject[key].asset == key/*why we need this check?*/ && assetsObject[key].quantity) sum += assetsObject[key].quantity
      }
    });
  }
  return sum;
};

/**
 * checks whether this user is allowed to use private accounts
 * currently just checks flag 'services.privateAccountsEnabled'
 * and we later will need this to be not flag, but have some time limits there..
 * @param user - user object.
 */
CF.UserAssets.isPrivateAccountsEnabled = function (user) {
  return true;
  //return !!(user && user.services && user.services.privateAccountsEnabled)
};


CF.UserAssets.accountsFields = {'accounts': 1, 'accountsPrivate': 1};
/**
 * returns 'accounts' or 'accountsPrivate' or ''
 * @param userId
 * @param accountKey - key to check
 * @returns {String} that indicates account type (public or private)
 */

CF.UserAssets.getAccountPrivacyType = function (userId, accountKey) {
  if (Meteor.isClient) {
    if (userId != Meteor.userId()) return ''
  }
  if (!userId || !accountKey) return '';

  var user = Meteor.users.findOne({_id: userId}, {fields: CF.UserAssets.accountsFields}),
    key = accountKey.toString(),
    pri = user.accountsPrivate || {},
    pub = user.accounts || {},
    isPublic = _.keys(pub).indexOf(key) > -1,
    isPrivate = _.keys(pri).indexOf(key) > -1;

  if ((isPublic && isPrivate) || (!isPrivate && !isPublic)) { // both cannot happen
    var err = "Error with user accounts, userId: " + userId + ' \n';
    if (!isPublic) {
      err += 'no account with key ' + key + ' found.'
    } else {
      err += 'duplicate accounts with key ' + key + ' found.'
    }
    if (Meteor.isServer) {
      console.warn(err);
    }
    return ''
  }
  return isPublic ? 'accounts' : 'accountsPrivate'
};