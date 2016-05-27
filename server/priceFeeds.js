const feeds = require("../imports/vwap/server");
Meteor.startup(function(){
  feeds.fetch()
})
