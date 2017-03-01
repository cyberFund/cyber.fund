import {Acounts} from '/imports/api/collections'
CF.UserAssets = {};

CF.Acounts.accountNameIsValid = function(name, refId, oldName) {
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

/**
 *
 * @param accounts - part of user document
 * in which accounts information is stored
 * @returns {Array} of system names
 */
// obsolete
CF.UserAssets.getSystemsFromAccountsObject = function(accounts) {
  if (!accounts) return [];
  //  console.log(accounts);

  var systems = _.flatten(accounts.map(function(account) {
    return _.values(account.addresses)
  }));

  if (systems) {
    systems = _.uniq(_.flatten(_.map(systems, function(address) {
      return (_.keys(address.assets))
    })));
  } else {
    return [];
  }
  return _.uniq(systems);
};

/**
 * return quantity of specified coins in niven accountsObjects
 * @param accountsObject - array of account objects, as they are in Acounts
 * @param key - system _id to check against
 * @returns {number} quantity of specified coins from accountsObject
 */
CF.UserAssets.getQuantitiesFromAccountsObject = function(accountsObject, key) {
  var sum = 0.0;
  if (accountsObject && key) {

    // i.e. accounts
    var rets = _.values(accountsObject);
    if (rets) {

      // i.e. adresses
      rets = _.flatten(_.map(rets, function(account) {
        return _.values(account.addresses)
      }));
    } else {

      // if no accounts then zero
      return sum;
    }

    // extract from addresses
    _.each(rets, function(assetsObject) {
      assetsObject = assetsObject.assets;
      if (assetsObject[key] && assetsObject[key].quantity) {
        sum += assetsObject[key].quantity
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
CF.UserAssets.isPrivateAccountsEnabled = function(user) {
  return true;
  //return !!(user && user.services && user.services.privateAccountsEnabled)
};

/**
 * returns 'accounts' or 'accountsPrivate' or ''
 * @param userId
 * @param accountKey - key to check
 * @returns {String} that indicates account type (public or private)
 */

CF.UserAssets.getAccountPrivacyType = function(accountKey) {
  var ret = CF.Acounts.findById(accountKey);
  return ret ? (ret.isPrivate ? 'accountsPrivate' : 'accounts') : 'undefined'
};
