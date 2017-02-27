import winston from 'winston'
SyncedCron.config({
  log: true,
  logger: winston,
  collectionTTL: 604800,
  utc: true
});

Meteor.startup(function(){
  if (!Meteor.settings.noFetch) {
    winston.log("--  -- starting synced cron");
    SyncedCron.start();
  }
});
