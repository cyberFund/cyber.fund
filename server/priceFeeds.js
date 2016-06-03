const feeds = require("../imports/vwap/server");
/*Meteor.startup(function(){
  feeds.fetch()
})*/

SyncedCron.add({
  name: "xchange feed",
  schedule: function (parser) {
    // parser is a later.parse object
    return parser.cron("10 0/3 * * * *", true);
  },
  job: function () {
    //feeds.fetchDirect() //todo remove
    const ret = feeds.fetchXchangeData();
    console.log(ret);
    console.log(ret.length);
    console.log("222")
  }
})

SyncedCron.add({
  name: "xchange vwap feed",
  schedule: function (parser) {
    return parser.cron("40 1/3 * * * *", true);
  },
  job: function () {
    const ret = feeds.fetchXchangeVwapData();
    console.log(ret);
    console.log(ret.length);
    console.log("111")
  }
})
