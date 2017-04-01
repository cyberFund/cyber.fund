//////////////////////////// hide domain
import {cfIsAccountHidden} from '/imports/api/client/cf/account'
import Acounts from '/imports/api/collections/Acounts'
import {normalizeOptionsPerUser} from '/imports/api/utils'

function gimmeData(refId) {
  return Acounts.find({refId: refId});
}

function getUserId() {
  var username = FlowRouter.getParam("username");
  var options = normalizeOptionsPerUser({username: username});
  return options.userId;
}

import cfAccounts from '/imports/api/cf/accounts/utils'
import {accumulate, extractAssets, findById} from '/imports/api/cf/accounts/utils'

function filterData() {
  var ret = [];
  var userId = getUserId();

  gimmeData(userId).forEach(function(account, accountKey) {
    let keys = Object.keys(account.addresses);
    _.each(account.addresses, function(addressObject, addressKey) {
      let assets = addressObject.assets
      account[accountKey]
      _.each(assets, function(assetObject, assetName) {
        if (!assetName)
          return
        if (assetObject) {
          if (assetObject.quantity > 0) {} else {
            if (assetObject.update === "auto") {
              delete account.addresses[addressKey].assets[assetName]
            }
          }
        }
      })
    })

    if (!cfIsAccountHidden(account._id))
      ret.push(account);
    }
  );
  return ret;
}

var userProfileData = function() {
  return filterData();
};

////////////////////////////// accounting domain

/*
* @param docs: array of
* @param accumulator: object to sum data from docs array - MUTABLE
* @returns accumulator
*/

//
function tableData() {
  return accumulate(userProfileData().map(function(it) {
    return extractAssets(it);
  }));
}

module.exports = {
  portfolioTableData: tableData,
  userProfileData: userProfileData
}
