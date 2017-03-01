//////////////////////////// hide domain
import {cfIsAccountHidden} from '/imports/api/client/cf/account'
import {Acounts} from '/imports/api/collections'
function getUserId() {
  var username = FlowRouter.getParam("username");
  var user = CF.Utils.normalizeOptionsPerUser({username:username});
  return user.userId;
}

function gimmeData (refId){
  return Acounts.find({refId: refId});
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

CF.Acounts.userProfileData = function(){
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
  return  CF.Acounts.accumulate(CF.Acounts.userProfileData().map(function(it) {
    return CF.Acounts.extractAssets(it);
  }));
}

CF.Acounts.portfolioTableData = tableData;
