import {Meteor} from 'meteor/meteor'
import {AcountsHistory} from '/imports/api/collections'
import Acounts from '/imports/api/collections/Acounts'
import {accumulate, extractAssets, findById} from '/imports/api/cf/accounts/utils'
import {putPoint} from '/imports/api/accountsHistory/singleAccountHistory'
import {getSystemsFromAccountsObject} from '/imports/api/cf/userAssets/utils'
const HOUR = 1000 * 60 * 60;
const historyInterval = 24 * HOUR;
const accountActual = historyInterval / 2;
// only work for user collection.
if (Meteor.isServer) {
  exports.updateUserFunds = function(userId) {
    const updatedAt = new Date()
    let sum = 0
    let sumUsd = 0
    let sumFull = 0
    let sumFullUsd = 0
    let historyPointsIndex = []
    let historyPoints = []
    let systemsList = []
    let systemsListPrivate = []

    var accounts = Acounts.find({
      refId: userId
    }, {
      fields: {
        isPrivate: 1,
        _id: 1
      }
    });

    accounts.forEach(function(item) {
      var result = putPoint(item._id);

      let listOfSystemsFromThisAccount = getSystemsFromAccountsObject([result && result.state]))

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

    AcountsHistory.insert({
      type: 'index',
      refId: userId,
      timestamp: updatedAt,
      public: {
        vBtc: sum,
        vUsd: sumUsd,
        shares: accumulate(historyPoints.map(function(it) {
          if (it.isPrivate) return {};
          return extractAssets(it);
        })),
        points: _.filter(historyPointsIndex, function(it) {
          return !it.isPrivate
        })
      },
      full: {
        shares: accumulate(historyPoints.map(function(it) {
          return extractAssets(it);
        })),
        vBtc: sumFull,
        vUsd: sumFullUsd,
        points: historyPointsIndex,
      }
    })
    return historyPointsIndex;
  }
}
