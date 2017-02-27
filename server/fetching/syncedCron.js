import winston from 'winston'
SyncedCron.config({
  log: true,
  logger: winston,
  collectionTTL: 604800,
  utc: true
});

console.log("SYNCED CRON")

Meteor.startup(function(){
  console.log("1")
  if (!Meteor.settings.noFetch) {
    console.log("2")
    winston.log("--  -- starting synced cron");
    SyncedCron.start();
  }
});
