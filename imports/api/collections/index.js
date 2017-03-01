var CurrentData = new Meteor.Collection("CurrentData", {
  transform: function(doc){
    return doc;
  }
});

var FastData = new Meteor.Collection("fast_market_data");
var Feeds = require("/imports/api/vwap/collections").feeds;
var FeedsVwap = require("/imports/api/vwap/collections").feedsVwap;
var Metrics = require('./Metrics')
var Extras = new Meteor.Collection("extras");
var AccountsHistory = new Meteor.Collection("accountsHistory")
module.exports = {
  CurrentData: CurrentData,
  FastData: FastData,
  Feeds: Feeds,
  FeedsVwap: FeedsVwap,
  Metrics: Metrics,
  Extras: Extras,
  AccountsHistory: AccountsHistory
}
