// currently, actual state only. history is stored in outer (non meteor) db

// history for feeds. nothing here yet
var feeds = new Mongo.Collection("xchange");

// current/last states. taken from es currently
var feedsCurrent = new Mongo.Collection("xchangeCurrent");

// volume weighted - current/last states. taken from es currently
var feedsVwapCurrent = new Mongo.Collection("xchangeVwapCurrent");

// those are readonly for clients
feeds.allow({
  insert: function(){return false;},
  update: function(){return false;},
  remove: function(){return false;}
});

feedsCurrent.allow({
  insert: function(){return false;},
  update: function(){return false;},
  remove: function(){return false;}
});

feedsVwapCurrent.allow({
  insert: function(){return false;},
  update: function(){return false;},
  remove: function(){return false;}
});

module.exports = {
  feeds: feeds,
  feedsCurrent: feedsCurrent,
  feedsVwapCurrent: feedsVwapCurrent
};
