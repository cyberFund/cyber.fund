// currently, let s only keep actual state here.

// history for feeds
var feeds = new Mongo.Collection("xchange");

// current/last states
var feedsCurrent = new Mongo.Collection("xchangeCurrent");

// volume weighted - history (will volume-weight on client.)
var feedsVwap = new Mongo.Collection("xchangeVwap");
feeds.allow({
  insert: function(){return false;},
  update: function(){return false;},
  remove: function(){return false;}
});

xchangeFeeds = feedsCurrent;
feedsCurrent.allow({
  insert: function(){return false;},
  update: function(){return false;},
  remove: function(){return false;}
});

feedsVwap.allow({
  insert: function(){return false;},
  update: function(){return false;},
  remove: function(){return false;}
});

module.exports = {
  feeds: feeds,
  feedsCurrent: feedsCurrent,
  feedsVwap: feedsVwap
};
