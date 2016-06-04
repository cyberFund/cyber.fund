const feeds = require("../imports/vwap/server");
/*Meteor.startup(function(){
  feeds.fetch()
})*/

SyncedCron.add({
  name: "xchange feed",
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.cron("40 2/3 * * * *", true);
  },
  job: function() {
    feeds.fetchXchangeData();
  }
})

SyncedCron.add({
  name: "xchange vwap feed",
  schedule: function(parser) {
    return parser.cron("10 1/3 * * * *", true);
  },
  job: function() {
    feeds.fetchXchangeVwapData();
  }
})
