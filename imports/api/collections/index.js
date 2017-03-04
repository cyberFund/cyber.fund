import { Meteor } from 'meteor/meteor'

var CurrentData = new Meteor.Collection("CurrentData", {
  transform: function(doc){
    return doc;
  }
});
var FastData = new Meteor.Collection("fast_market_data");
var FeedsVwap = require("/imports/api/vwap/collections").feedsVwap;
var Metrics = new Meteor.Collection('Metrics')
var Extras = new Meteor.Collection("extras");
var MarketData = new Meteor.Collection("MarketData");
var AcountsHistory = new Meteor.Collection("accountsHistory")

if (Meteor.isServer) {
  AcountsHistory._ensureIndex({
    timestamp: -1
  });

  AcountsHistory._ensureIndex({
    refId: 1, timestamp: -1
  });

  AcountsHistory._ensureIndex({
    accountId: 1, timestamp: -1
  });
}

AcountsHistory.allow({
  insert: function(userId, doc) {
    return false;
  },
  update: function(userId, doc, fieldNames, modifier) {
    return false;
  },
  remove: function(userId, doc) {
    return false;
  }
});




module.exports = {
  CurrentData: CurrentData,
  FastData: FastData,
  Metrics: Metrics,
  Extras: Extras,
  AcountsHistory: AcountsHistory,
  MarketData: MarketData
}
