const HOUR = 1000*60*60;
const historyInterval = 24*HOUR;
const accountActual = historyInterval/2;

const putPoint = require('../accountsHistory/singleAccountHistory').putPoint

// only work for user collection.
exports.updateUserFunds = function(userId){
  let sum = 0;
  let historyPoints = [];
  var accounts = CF.Accounts.collection.find({refId: userId}, {fields: {isPrivate:1, _id: 1}});

  accounts.forEach(function(item){
    var result = putPoint(item._id);
    if (result) {
      historyPoints.push({isPrivate: item.isPrivate, itemId: result._id})
      if (!item.isPrivate) sum += result.vBtc || 0;
    }
  });
  Meteor.users.update({_id: userId}, {$set: {
    publicFunds: sum,
    publicFundsUpdatedAt: new Date()
  }});

  return historyPoints;
}
