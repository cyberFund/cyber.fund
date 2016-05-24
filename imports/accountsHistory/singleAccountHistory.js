const HOUR = 1000*60*60;
const historyInterval = 24*HOUR;
const accountActual = historyInterval/2;

if (Meteor.isServer) {
  exports.putPoint = function(accountId){
    var account = CF.Accounts.collection.findOne({_id: accountId});
    if (!account) return;
    
  }
}
