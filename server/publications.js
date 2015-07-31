/**
 * currentData, just fields enough to draw rating table..
 */
Meteor.publish("currentDataRP", function (options) {
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

/**
 * fetch full currentData document
 */
Meteor.publish('systemData', function (options) {
  //still using name & symbol. probably got to refactor to avoid confusion in future
  var name = options.name;
  var symbol = options.symbol;
  if (symbol && name) {
    return CurrentData.find(CF.CurrentData.selectors.system_symbol(name, symbol));
  }
  if (name) {
    return CurrentData.find(CF.CurrentData.selectors.system(name));
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

Meteor.publish('search-sys', function(selector, options, collname) {
  console.log(selector);
  var s = selector["aliases.CurrencyName"];
  if (s) {
    selector = {$or:
      [
        {"aliases.CurrencyName": s},
        {"system": s},
        {"nickname": s}
      ]};
  } else return [];
  /*var keys = ["aliases.CurrencyName", "system", "nickname"];
  var k = false;
  _.each(keys, function(key){
    if (selector[key]) k = true;
  });
   if (!k) return [];
  */


  var collection;
  if (collname == "CurrentData")
    collection = CurrentData;
  if (!collection) return [];
  options.fields = {"system": 1, "icon": 1, "aliases.CurrencyName": 1, "nickname": 1};
  Autocomplete.publishCursor( collection.find(selector, options), this);
  this.ready();
});