var logger = CF.Utils.logger.getLogger("meteor");

Meteor.startup(function () {
  logger.print("Server started in " + process.env.NODE_ENV + " mode", "i m sure");
  //logger.info("Server started in " + process.env.NODE_ENV + " mode");
});
