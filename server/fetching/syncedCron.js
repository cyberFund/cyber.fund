SyncedCron.config({
  log: false,
  //logger: log4js.getLogger("synced-cron"),
  collectionTTL: 604800,
  utc: true
});

{

  if (!Meteor.settings.noFetch) {
    console.log("starting synced cron");
    SyncedCron.start();
  }
}
