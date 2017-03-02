import {findById} from '/imports/api/cf/accounts/utils'
var cfUserAssets = {};

/**
 *
 * @param accounts - part of user document
 * in which accounts information is stored
 * @returns {Array} of system names
 */
// obsolete
cfUserAssets.getSystemsFromAccountsObject = function(accounts) {
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
cfUserAssets.getQuantitiesFromAccountsObject = function(accountsObject, key) {
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
 * returns 'accounts' or 'accountsPrivate' or ''
 * @param userId
 * @param accountKey - key to check
 * @returns {String} that indicates account type (public or private)
 */

cfUserAssets.getAccountPrivacyType = function(accountKey) {
  var ret = findById(accountKey);
  return ret ? (ret.isPrivate ? 'accountsPrivate' : 'accounts') : 'undefined'
};
import graph from './graph'
cfUserAssets.graph = graph
module.exports = cfUserAssets
