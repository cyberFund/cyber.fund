/**
 * currentData, just fields enough to draw rating table..
 */
Meteor.publish("currentDataRP", function(options) {
  options = options || {};
  var defaultLimit = 1;
  var selector = {};
  options.sort = options.sort || {};
  if (!_.keys(options.sort).length) options.sort = CF.Rating.sorter0;
  if (isNaN(options.limit)) options.limit = defaultLimit;
  options.fields = {
    "aliases": 1,
    "metrics": 1,
    "system": 1,
    "token": 1,
    "icon": 1,
    "ratings": 1,
    "_usersStarred": 1,
    "calculatable": 1,

    "descriptions": 1
  };

  var keys = _.keys(options.sort);
  selector[keys[0]] = {
    $exists: true
  };
  selector['flags.rating_do_not_display'] = {
    $ne: true
  };
  return CurrentData.find(selector, options);
});

/* own user details */
Meteor.publish('userDetails', function() {
  return Meteor.users.find({
    _id: this.userId
  }, {
    fields: {
      "services.twitter.screenName": 1,
      "services.twitter.profile_image_url_https": 1,
      "services.privateAccountsEnabled": 1
    }
  });
});

/**
 * fetch full currentData document
 */
Meteor.publish('systemData', function(options) {
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
  return this.ready();
});


/*
  fetch systems that are displayed at radar page.
 */
Meteor.publish('crowdsalesList', function() {
  var sel = CF.Chaingear.selector.crowdsales;
  return CurrentData.find(sel, {
    fields: {
      dailyData: 0,
      hourlyData: 0
    }
  });
});

Meteor.publish('projectsList', function() {
  var sel = CF.Chaingear.selector.projectsList;
  return CurrentData.find(sel, {
    fields: {
      dailyData: 0,
      hourlyData: 0
    }
  });
})


/*
  only needed to display users count on profile page
 */
Meteor.publish("usersCount", function() {
  Counts.publish(this, 'usersCount', Meteor.users.find());
});

/*
  needed to know are there systems left, or we subscribed with limit >=
  number of coins. i.e. allows to hide button "show more systems" when there s nothing left
 */
Meteor.publish('coinsCount', function() {
  Counts.publish(this, 'coinsCounter', CurrentData.find({
    "metrics.cap.btc": {
      $gt: 0
    }
  }));
});

/*
  provide enough details to render dependent coins at system page
 */
Meteor.publish('dependentCoins', function(system) {
  return CurrentData.find(CF.CurrentData.selectors.dependents(system), {
    fields: {
      "system": 1,
      "icon": 1,
      "dependencies": 1,
      "aliases": 1,
      'token': 1
    }
  })
});

/*
  provides data to draw daily chart
   - this currently is stored apart from CurrentData documents
 */
Meteor.publish('fastData', function(systemName) {
  var _id = CurrentData.findOne({
    system: systemName
  });
  if (!_id) return this.ready();
  _id = _id._id;
  return FastData.find({
    systemId: _id
  });
});

/*
 provides details on coins   that current coin depends on . accepts
 list of system names
 */
Meteor.publish('dependencies', function(deps) {
  return CurrentData.find(CF.CurrentData.selectors.dependencies(deps), {
    fields: {
      "system": 1,
      "icon": 1,
      "dependencies": 1,
      "aliases": 1,
      'token': 1
    }
  })
});

/*
  provides means for autocomplete to work
 */
Meteor.publish('search-sys', function(selector, options, collname) {
  var s = selector["token.token_name"];
  if (s) {
    selector = {
      $or: [{
        'token.token_symbol': s
      }, {
        "system": s
      }, {
        "aliases.nickname": s
      }, {
        "token.token_name": s
      }]
    };
  } else {
    return this.ready();
  }
  var collection;
  if (collname == "CurrentData") {
    collection = CurrentData;
  }
  if (!collection) return this.ready();

  options.fields = {
    "system": 1,
    "icon": 1,
    "aliases": 1,
    "token": 1
  };
  options.sort = {
    "ratings.rating_cyber": -1,
    "metrics.cap.btc": -1
  };
  Autocomplete.publishCursor(collection.find(selector, options), this);
  this.ready();
});


/*
  have to publish whole bitcoin document... too bad - as it s heavy.
  would either split market data from docs, or manage subscriptions better
 */
Meteor.publish("BitcoinPrice", function() {
  return CurrentData.find({
    system: "Bitcoin"
  })
});

Meteor.publish('avatars', function(uidArray) {
  if (!_.isArray(uidArray)) return this.ready();
  return Meteor.users.find({
    _id: {
      $in: uidArray
    }
  }, {
    fields: {
      'profile.name': 1,
      'profile.twitterIconUrlHttps': 1,
      'profile.twitterIconUrl': 1,
      'profile.twitterName': 1
    }
  });
});

/*
  user profile by twitter screenname
 */
Meteor.publish('userProfileByTwid', function(twid) {
  var ownTwid = null;
  if (this.userId) {
    ownTwid = Meteor.users.findOne({
      _id: this.userId
    }).profile.twitterName
  }
  var fields = {
    'profile': 1,
    accounts: 1,
    createdAt: 1
  };
  if (ownTwid == twid) fields.accountsPrivate = 1;
  return Meteor.users.find({
    "profile.twitterName": twid
  }, {
    fields: fields
  });
});

/*
  return fields to display portfolio
  probably buggy as tends to load private accounts
   for a moment after switching from "own" user to another
 */
Meteor.publish('portfolioUser', function(userId) {
  var isOwn = this.userId == userId;
  var fields = {
    'profile': 1,
    accounts: 1,
    createdAt: 1
  };
  if (isOwn) _.extend(fields, {
    accountsPrivate: 1
  });
  return Meteor.users.find({
    _id: this.userId
  }, {
    fields: fields
  });
});

/*
  support subscription for assets manager, loads info to display,
   currency links in portfolio, depends on list of systems
 */
Meteor.publish('assetsSystems', function(tokens) {
  return CurrentData.find(CF.CurrentData.selectors.system(tokens), {
    fields: {
      system: 1,
      token: 1,
      aliases: 1,
      icon: 1
    }
  })
});

/*
  support subscription for profile page, loads info to display currency links
  resolves needed list by userId
 */
Meteor.publish('profilesSystems', function(userId) {
  var user = Meteor.users.findOne({
    _id: userId
  });
  var tokens = user && user.profile && user.profile.starredSystems || [];
  return CurrentData.find(CF.CurrentData.selectors.system(tokens), {
    fields: {
      system: 1,
      token: 1,
      aliases: 1,
      icon: 1
    }
  }); //todo: fieldsets => resp. packages
});

/*
  loads systems data for portfolio
 */

Meteor.publish("portfolioSystems", function(userId, options) {
  options = options || {};

  var own = this.userId == userId;
  var user = Meteor.users.findOne({
    _id: userId
  });
  if (!user) return this.ready();
  var systems = CF.UserAssets.getSystemsFromAccountsObject(user.accounts);

  if (own) {
    if (options.privateAssets) { //todo: unbind against this && user details subscriptions
      systems = _.union(systems, CF.UserAssets.getSystemsFromAccountsObject(user.accountsPrivate))
    }
    var stars = user.profile.starredSystems;
    if (stars && stars.length) {

      var plck = _.map(CurrentData.find({
        system: {
          $in: stars
        }
      }, {
        fields: {
          'system': 1
        }
      }).fetch(), function(it) {
        return it.system;
      });
      systems = _.union(systems, plck)
    }
  }

  return CurrentData.find(CF.CurrentData.selectors.system(systems), {
    fields: {
      "aliases": 1,
      "metrics": 1,
      "system": 1,
      "token": 1,
      "icon": 1,
      "ratings": 1
    }
  })
});
