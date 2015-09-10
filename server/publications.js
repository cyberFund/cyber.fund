/**
 * currentData, just fields enough to draw rating table..
 */
Meteor.publish("currentDataRP", function (options) {
  options = options || {};
  var defaultLimit = 0;
  var selector = {};
  if (!_.keys(options.sort).length) options.sort = CF.Rating.sorter0;
  if (isNaN(options.limit)) options.limit = defaultLimit;
  options.fields = {
    "aliases": 1, "metrics": 1, "system": 1, "token": 1, "icon": 1, "ratings": 1
  };
  var keys = _.keys(options.sort)
  selector[keys[0]] = {$exists: true}
  console.log(selector)
  return CurrentData.find(selector, options);
});

Meteor.methods({
  currentDataCount: function () {
    return CurrentData.find(/*{"metrics.cap.btc": {$gt: 0}}*/).count();
  }
});

Meteor.publish("fresh-price", function () {
  //return MarketData.find({"token.token_symbol": 'BTC', 'metrics.price': {$exists: true}},
  //{sort: {timestamp: -1}, limit: 1});
  return []; // no marketdata as of now
});


Meteor.publish('userDetails', function () {
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

Meteor.publish("usersCount", function () {
  Counts.publish(this, 'usersCount', Meteor.users.find());
});

Meteor.publish('coinsCount', function() {
  Counts.publish(this, 'coinsCounter', CurrentData.find({"metrics.cap.btc": {$gt: 0}}));
});

Meteor.publish('dependentCoins', function (system) {
  return CurrentData.find(CF.CurrentData.selectors.dependents(system), {
    fields: {
      "system": 1, "icon": 1, "dependencies": 1, "aliases": 1
    }
  })
});
Meteor.publish('fastData', function (systemName) {
  var _id = CurrentData.findOne({system: systemName});
  if (!_id) return this.ready();
  _id = _id._id;
  return FastData.find({systemId: _id});
})

Meteor.publish('dependencies', function (deps) {
  return CurrentData.find(CF.CurrentData.selectors.dependencies(deps), {
    fields: {
      "system": 1, "icon": 1, "dependencies": 1, "aliases": 1
    }
  })
});


Meteor.publish('search-sys', function (selector, options, collname) {
  var s = selector["aliases.CurrencyName"];
  if (s) {

    selector = {
      $or: [
        {'token.token_symbol': s},
        {"system": s},
        {"aliases.nickname": s},
        {"aliases.CurrencyName": s}
      ]
    };
  } else {
    return this.ready();
  }
  var collection;
  if (collname == "CurrentData") {
    collection = CurrentData;
  }
  if (!collection) return [];

  options.fields = {"system": 1, "icon": 1, "aliases": 1, "token": 1};
  options.sort = {
    "ratings.rating_cyber": -1,
    "metrics.cap.btc": -1
  };
  Autocomplete.publishCursor(collection.find(selector, options), this);
  this.ready();
});

Meteor.publish("BitcoinPrice", function () {
  return CurrentData.find({system: "Bitcoin"})
});

Meteor.publish('avatars', function (uidArray) {
  if (!_.isArray(uidArray)) return this.ready();
  return Meteor.users.find({_id: {$in: uidArray}}, {
    fields: {
      'profile.name': 1,
      'profile.twitterIconUrlHttps': 1,
      'profile.twitterIconUrl': 1,
      'profile.twitterName': 1
    }
  });
});

Meteor.publish('userProfileByTwid', function (twid) {
  return Meteor.users.find({"profile.twitterName": twid}, {
    fields: {
      'profile': 1, accounts: 1, createdAt: 1
    }
  });
});

Meteor.publish('portfolioUser', function () {
  if (!this.userId) return this.ready();
  return Meteor.users.find({_id: this.userId}, {
    fields: {
      'profile': 1, accounts: 1, createdAt: 1
    }
  });
})

Meteor.publish('assetsSystems', function (tokens) {
  return CurrentData.find(CF.CurrentData.selectors.system(tokens), {
    fields: {system: 1, token: 1, aliases: 1, icon: 1}
  })
});

Meteor.publish('profilesSystems', function (userId) {
  var user = Meteor.users.findOne({_id: userId});
  var tokens = user && user.profile && user.profile.starredSystems || [];
  return CurrentData.find(CF.CurrentData.selectors.system(tokens), {
    fields: {system: 1, token: 1, aliases: 1, icon: 1}
  }) //todo: fieldsets => resp. packages
});

Meteor.publish("portfolioSystems", function (options) {
  options = options || {};
  if (!this.userId) return this.ready();
  var user = Meteor.users.findOne({_id: this.userId});

  var systems = CF.UserAssets.getSystemsFromAccountsObject(user.accounts)
  if (options.privateAssets) {
    systems = _.union(systems, CF.UserAssets.getSystemsFromAccountsObject(user.accountsPrivate))
  }

  var stars = user.profile.starredSystems;
  if (stars && stars.length) {

    var plck = _.map(CurrentData.find({system: {$in: stars}},
      {fields: {'system': 1}}).fetch(), function (it) {
      return it.system;
    });
    systems = _.union(systems, plck)
  }
  return CurrentData.find(CF.CurrentData.selectors.system(systems),
    {
      fields: {
        "aliases": 1,
        "metrics": 1,
        "system": 1,
        "token": 1,
        "icon": 1,
        "ratings": 1
      }
    })
})