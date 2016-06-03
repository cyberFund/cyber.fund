//////////////////////////// hide domain
CF.Accounts.isHidden = function isHidden(accountId){
  return Session.get("hideAccount_"+(accountId));
};

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

  gimmeData(userId).forEach(function (account){
    if (!CF.Accounts.isHidden(account._id)) ret.push(account);
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
