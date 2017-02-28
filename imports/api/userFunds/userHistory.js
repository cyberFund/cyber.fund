const HOUR = 1000 * 60 * 60;
const historyInterval = 24 * HOUR;
const accountActual = historyInterval / 2;

const putPoint = require('../accountsHistory/singleAccountHistory').putPoint

// only work for user collection.
if (Meteor.isServer) {
  exports.updateUserFunds = function(userId) {
    const updatedAt = new Date()
    let sum = 0,
      sumUsd = 0,
      sumFull = 0
    sumFullUsd = 0;
    let historyPointsIndex = [],
      historyPoints = []

    var accounts = CF.Accounts.collection.find({
      refId: userId
    }, {
      fields: {
        isPrivate: 1,
        _id: 1
      }
    });

    accounts.forEach(function(item) {
      var result = putPoint(item._id);
      if (result) {
        historyPointsIndex.push({
          isPrivate: item.isPrivate,
          itemId: result._id
        })
        if (!item.isPrivate) {
          sum += result.state.vBtc || 0;
          sumUsd += result.state.vUsd || 0;
        }
        sumFull += result.state.vBtc || 0;
        sumFullUsd += result.state.vUsd || 0;
        historyPoints.push(result.state);
      }
    });

    Meteor.users.update({
      _id: userId
    }, {
      $set: {
        publicFunds: sum,
        publicFundsUsd: sumUsd,
        publicFundsUpdatedAt: updatedAt
      }
    });

    CF.Accounts.History.collection.insert({
      type: 'index',
      refId: userId,
      timestamp: updatedAt,
      public: {
        vBtc: sum,
        vUsd: sumUsd,
        shares: CF.Accounts.accumulate(historyPoints.map(function(it) {
          if (it.isPrivate) return {};
          return CF.Accounts.extractAssets(it);
        })),
        points: _.filter(historyPointsIndex, function(it) {
          return !it.isPrivate
        })
      },
      full: {
        shares: CF.Accounts.accumulate(historyPoints.map(function(it) {
          return CF.Accounts.extractAssets(it);
        })),
        vBtc: sumFull,
        vUsd: sumFullUsd,
        points: historyPointsIndex,
      }
    })
    return historyPointsIndex;
  }
}
