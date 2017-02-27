//////////////////////////// hide domain
import {cfIsAccountHidden} from '/imports/api/cfAccount'

CF.Accounts.hiddenToggle = function(accountId){
  if (!accountId) return;
  Session.set("hideAccount_"+(accountId), !Session.get("hideAccount_"+(accountId)));
};

function getUserId() {
  var username = FlowRouter.getParam("username");
  var user = CF.Utils.normalizeOptionsPerUser({username:username});
  return user.userId;
}

function gimmeData (refId){
  return CF.Accounts.collection.find({refId: refId});
}

function filterData(){
  var ret = [];
  var userId = getUserId();

  gimmeData(userId).forEach(function (account, accountKey){
    let keys = Object.keys(account.addresses);
    _.each(account.addresses, function(addressObject, addressKey){
      let assets = addressObject.assets
      account[accountKey]
      _.each(assets, function(assetObject, assetName){
        if (!assetName) return
        //console.log(`address '${addressKey}'`)
        if (assetObject) {
          if (assetObject.quantity > 0) {
          } else {
            if (assetObject.update === "auto") {
              delete account.addresses[addressKey].assets[assetName]
            }
            //delete account.addresses[addressKey]
          }
        }
      })
    })

    if (!cfIsAccountHidden(account._id)) ret.push(account);
  });
  return ret;
}

CF.Accounts.userProfileData = function(){
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
  return  CF.Accounts.accumulate(CF.Accounts.userProfileData().map(function(it) {
    return CF.Accounts.extractAssets(it);
  }));
}

CF.Accounts.portfolioTableData = tableData;
