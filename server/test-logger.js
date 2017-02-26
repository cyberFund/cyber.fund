import winston  from 'winston'

Meteor.startup(function () {
  winston.info("Server started in " + process.env.NODE_ENV + " mode");
});

Meteor.methods({
  getEnv: function(){
    return process.env.NODE_ENV;
  }
})
