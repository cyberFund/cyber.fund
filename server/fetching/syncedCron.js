SyncedCron.config({
  log: false,
  //logger: CF.Utils.logger.getLogger("synced-cron"),
  collectionTTL: 604800,
  utc: true
});

{

  if (!Meteor.settings.noFetch) {
    console.log("starting synced cron");
    SyncedCron.start();
  }
}
