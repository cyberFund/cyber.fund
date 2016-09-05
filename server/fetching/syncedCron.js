SyncedCron.config({
  log: true,
  //logger: CF.Utils.logger.getLogger("synced-cron"),
  collectionTTL: 604800,
  utc: true
});

Meteor.startup(function(){
  if (!Meteor.settings.noFetch) {
    console.log("starting synced cron");
    SyncedCron.start();
  }
});
