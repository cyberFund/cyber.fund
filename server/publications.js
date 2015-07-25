Meteor.publish("current-data", function (options) {
  options = options || {};
  var selector = {};
  var params = {sort: {"ratings.rating_cyber": -1, "metrics.cap.btc": -1}};
  if (!isNaN(options["ratings.rating_cyber"])) selector["ratings.rating_cyber"] = {$gte: options["ratings.rating_cyber"]};
  if (!isNaN(options.limit)) params.limit = options.limit;
  params.fields = {
    "aliases.CurrencyName": 1, "metrics": 1, "system": 1, "token": 1, "icon": 1, "ratings": 1,
    "nickname": 1
  };
  return CurrentData.find(selector, params);
});

Meteor.methods({
  currentDataCount: function () {
    return CurrentData.find({"metrics.cap.btc": {$gt: 0}}).count();
  }
});

Meteor.publish("fresh-price", function () {
  //return MarketData.find({"token.token_symbol": 'BTC', 'metrics.price': {$exists: true}},
  //{sort: {timestamp: -1}, limit: 1});
  return []; // no marketdata as of now
});

Meteor.publish('userDetails', function () {
  //console.log(Meteor.users.findOne({_id: this.userId}));

  return Meteor.users.find({_id: this.userId}, {
    fields: {
      "services.twitter.screenName": 1,
      "services.twitter.profile_image_url_https": 1
    }
  });
});

Meteor.publish('customCurrentData', function (selector, options) { //TODO: refactor this and all usages. this is not safe
  options = options || {};
  return CurrentData.find(selector, options);
});

Meteor.publish('customMarketData', function (selector, options) { //TODO: refactor this and all usages. this is not safe
  options = options || {};
  return MarketData.find(selector, options);
});

Meteor.publish('systemData', function (options) {
  //still using name & symbol. probably got to refactor to avoid confusion in future
  var name = options.name;
  var symbol = options.symbol;
  if (symbol && name) {
    return CurrentData.find(CF.CurrentData.selectors.name_symbol(name, symbol));
  }
  if (name) {
    return CurrentData.find(CF.CurrentData.selectors.name(name));
  }
  if (symbol) {
    return CurrentData.find(CF.CurrentData.selectors.symbol(symbol));
  }
  return [];
});

Meteor.publish('crowdsale', function () {
  return CurrentData.find(CF.Chaingear.selector.crowdsales);
});

Meteor.publish("usersCount", function(){
  Counts.publish(this, 'usersCount', Meteor.users.find());
});

Meteor.publish('dependentCoins', function(system) {
  return CurrentData.find(CF.CurrentData.selectors.dependents(system), {
    fields: {
      "system": 1, "icon": 1, "dependencies": 1, "aliases.CurrencyName":1, "nickname": 1
    }
  })
});