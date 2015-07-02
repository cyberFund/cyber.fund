Meteor.publish("current-data", function (options) {
  options = options || {};
  var selector = {};
  var params = {sort: {"rating": -1, "cap.btc": -1}};
  if (!isNaN(options.rating)) selector["metrics.rating"] = {$gte: options.rating};
  if (!isNaN(options.limit)) params.limit = options.limit;
  return CurrentData.find(selector, params);
});

Meteor.methods({
  currentDataCount: function () {
    return CurrentData.find({"cap.btc": {$gt: 0}}).count();
  }
});

Meteor.publish("fresh-price", function () {
  return MarketData.find({symbol: 'BTC', 'metrics.price': {$exists: true}},
    {sort: {timestamp: -1}, limit: 1});
});

Meteor.publish(null, function () {
  return Meteor.users.find({_id: this.userId}, {
    fields: { "services.twitter.screenName": 1, "services.twitter.profile_image_url_https": 1}
  });
});

Meteor.publish('customCurrentData', function(selector, options){ //TODO: refactor this and all usages. this is not safe
  options = options || {};
  return CurrentData.find(selector, options);
});

Meteor.publish('customMarketData', function(selector, options){ //TODO: refactor this and all usages. this is not safe
  options = options || {};
  return MarketData.find(selector, options);
});

Meteor.publish('crowdsale', function(){
  return CurrentData.find(CF.Chaingear.selector.crowdsales);
});