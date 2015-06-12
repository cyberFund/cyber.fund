var logger = log4js.getLogger("meteor");

Meteor.startup(function () {
  logger.info("Server started in " + process.env.NODE_ENV + " mode");
});