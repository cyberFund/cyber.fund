SyncedCron.config({
  log: false,
  //logger: log4js.getLogger("synced-cron"),
  collectionTTL: 604800,
  utc: true
});
//if (!process.env.GO_AWAY_SYNCED_CRON)
{

  if (!Meteor.settings.noFetch) {
    console.log("starting synced cron");
    SyncedCron.start();
  }
}

CF.CurrentData.calculatables.addCalculatable('numOfStarred', function(system){
  console.log(system.system+"..")
  var n = system._usersStarred ? system._usersStarred.length : 0;
  return n;
})

SyncedCron.add({
  name: 'recalculate #of followers',
  schedule: function (parser) {
    // parser is a later.parse object
    return parser.text('every 20 seconds')
  },
  job: function () {
    console.log ("started recalculating # of followers")
    CF.CurrentData.calculatables.triggerCalc ('numOfStarred')
  }
});
