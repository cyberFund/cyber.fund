CurrentData = new Meteor.Collection("CurrentData", {
  transform: function(doc){
    return doc;
  }
});

FastData = new Meteor.Collection("fast_market_data");
Feeds = require("../imports/api/vwap/collections").feeds;
FeedsVwap = require("../imports/api/vwap/collections").feedsVwap;
