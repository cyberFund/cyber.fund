SyncedCron.config({
  log: true,
  collectionTTL: 604800,
  utc: true
});

Meteor.startup(function () {
  if (!Meteor.settings.noFetch) {
    console.log("--  -- starting synced cron");
    SyncedCron.start();
  } else {
		console.log('not starting synced cron due to settings')
  }

});
