CurrentData = new Meteor.Collection("CurrentData", {
  transform: function(doc){
    return doc;
  }
});


Feeds = require("../imports/vwap/collections").feeds;
FeedsVwap = require("../imports/vwap/collections").feedsVwap;
