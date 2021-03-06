var logger = CF.Utils.logger.getLogger("meteor");

Meteor.startup(function () {
  logger.info("Server started in " + process.env.NODE_ENV + " mode");
});

Meteor.methods({
  getEnv: function(){
    return process.env.NODE_ENV;
  }
})
