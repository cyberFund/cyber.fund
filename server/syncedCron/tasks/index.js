import {saveTotalCap} from '/imports/api/currentData/totalCap'

console.log(saveTotalCap)

Meteor.startup(function(){
  saveTotalCap();
});

SyncedCron.add({
  name: "total btc cap",
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.cron("* 1 * * *", false);
  },
  job: function() {
    try {
      saveTotalCap();
    } catch (e) {
      console.log("could not fetch elastic data (latest)");
    }
  }
});
