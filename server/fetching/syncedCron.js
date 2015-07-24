SyncedCron.config({
  logger: log4js.getLogger("synced-cron"),
  collectionTTL: 604800,

});
SyncedCron.start();
