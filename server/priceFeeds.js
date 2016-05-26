const go = require("../imports/rethinkdb/server").go;
Meteor.startup(function(){
  go();
})
