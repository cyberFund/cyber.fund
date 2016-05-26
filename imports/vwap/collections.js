// currently, let s only keep actual state here.
var feeds = new Mongo.Collection("xchange");
var feedsVwap = new Mongo.Collection("xchangeVwap");
feeds.allow({
  insert: function(){return false;},
  update: function(){return false;},
  remove: function(){return false;}
});
feeds;
feedsVwap.allow({
  insert: function(){return false;},
  update: function(){return false;},
  remove: function(){return false;}
});

module.exports = {
  feeds: feeds,
  feedsVwap: feedsVwap
};
