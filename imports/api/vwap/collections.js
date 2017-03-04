// currently, actual state only. history is stored in outer (non meteor) db

// current/last states. taken from es currently
var xchangeCurrent = new Mongo.Collection("xchangeCurrent");

// volume weighted - current/last states. taken from es currently
var xchangeVwapCurrent = new Mongo.Collection("xchangeVwapCurrent");

// those are readonly for clients
xchangeCurrent.allow({
  insert: function(){return false;},
  update: function(){return false;},
  remove: function(){return false;}
});

xchangeVwapCurrent.allow({
  insert: function(){return false;},
  update: function(){return false;},
  remove: function(){return false;}
});

module.exports = {
  xchangeCurrent: xchangeCurrent,
  xchangeVwapCurrent: xchangeVwapCurrent
};
