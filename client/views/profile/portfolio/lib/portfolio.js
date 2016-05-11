//////////////////////////// hide domain
CF.Accounts.isHidden = function isHidden(accountId){
  return Session.get('hideAccount_'+(accountId));
}

CF.Accounts.hiddenToggle = function(accountId){
  if (!accountId) return;
  Session.set('hideAccount_'+(accountId), !Session.get('hideAccount_'+(accountId)));
}

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
  return filterData()
}

////////////////////////////// accounting domain
/*
*
*/
CF.Accounts.accumulate = function(docs, accumulator){
  var ret = accumulator || {}
  docs.forEach(function(doc){
    _.each(doc, function(asset, assetId){
      if (ret[assetId]) ret[assetId].quantity += asset.quantity || 0;
      else ret[assetId] = {
        quantity: asset.quantity || 0
      }
    });
  });
  return ret;
}

// works with single account document, returns only {
//  key: {quantity:q}, ...
//}
CF.Accounts.extractAssets = function flatten(doc) {
  var ret = []
  if (doc.addresses) {
    _.each(doc.addresses, function(assetsDoc, address) {
      if (assetsDoc.assets) {
        ret.push(assetsDoc.assets);
      }
    })
  }
  return CF.Accounts.accumulate(ret);
}

// works with set of 'normalized' docs
CF.Accounts.extractAssetsMany = function flattenMany(docs){
  var ret = {}
  docs.map(function(doc){

  })
}
