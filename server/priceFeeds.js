const feeds = require("../imports/api/vwap/server");
/*Meteor.startup(function(){
  feeds.fetch()
})*/

SyncedCron.add({
  name: "xchange feed",
  schedule: function (parser) {
    // parser is a later.parse object
    return parser.cron("40 0/1 * * * *", true);
  },
  job: function () {
    feeds.fetch()
  }
})
