/**
 * currentData, just fields enough to draw rating table..
 */
Meteor.publish("currentDataRP", function(options) {
  options = options || {};
  var selector = options.selector;

  // if sorting, fetch only those having defined value for sorted column
  options.fields = {
    "aliases": 1,
    "metrics": 1,
    "token": 1,
    "icon": 1,
    "ratings": 1,
    "_usersStarred": 1,
    "calculatable": 1,
    "descriptions": 1,
    "consensus": 1,
    "first_price": 1,
    "lastData": 1 //wtf is going here
  };

  return CurrentData.find(selector, options)
});

Meteor.publish('marketDataRP', function(options) {
  options = options || {};
  var selector = options.selector;

  var list = _.pluck(CurrentData.find(selector, {fields: {_id: 1}}).fetch(), "_id")

  function intervalSelector(){
    return Meteor.settings.public && Meteor.settings.public.manyData ?
     'hourly' : 'daily'
  }
  var date = moment.utc().subtract(30, "days").startOf('day').toDate();

  return MarketData.find({
      systemId: {$in: list},
      timestamp: {$gte: date },
      interval: intervalSelector()}); // 'daily' ! remove this, stick to daily everywhere, was only for dev
})

/* own user details */
Meteor.publish('userDetails', function() {
  return [Meteor.users.find({
    _id: this.userId
  }, {
    fields: {
      "services.privateAccountsEnabled": 1,
      "username": 1,
      "avatar": 1,
      "largeAvatar": 1,
      "firstLogin": 1,
      "profile": 1
    }
  }), CF.Accounts._findByUserId(this.userId, {private: true}) ];
});

/**
 * fetch full currentData document
 */
Meteor.publish('systemData', function(options) {
  options = options || {}
  var name =  (typeof options === 'string') ? options : options.name
  console.log ("requested system "+ name);
  if (name) {
    return CurrentData.find(CF.CurrentData.selectors.system(name));
  }
  return this.ready();
});


/*
  fetch systems that are displayed at radar page.
 */
 Meteor.publish('crowdsalesAndProjectsList', function() {
   var doc = Extras.findOne({_id: 'radarList'})
   if (!doc) return this.ready()
   var ids = _.union(doc.crowdsales || [], doc.projects || []);
   return CurrentData.find({_id: {$in: ids}}, {
     fields: {
       crowdsales: 1,
       descriptions: 1,
       _id: 1,
       aliases: 1,
       icon: 1,
       metrics: 1,
       _usersStarred: 1,
       "calculatable.RATING.vector.LV.sum": 1
     }
   });
 })

Meteor.publish('crowdsalesActive', function() {
  var doc = Extras.findOne({_id: 'radarList'})
  if (!doc) return this.ready()
  var ids = _.union(doc.crowdsales || [], doc.projects || []);
  return CurrentData.find({
    _id: {$in: ids},
    'crowdsales.end_date': {
      $gt: new Date()
    },
    'crowdsales.start_date': {
      $lt: new Date()
    }},
      {
    fields: {
      dailyData: 0, //obsolete
      hourlyData: 0
    }
  });
});

/* obsolete
Meteor.publish('projectsList', function() {
  var sel = CF.CurrentData.selectors.projects();
  return CurrentData.find(sel, {
    fields: {
      dailyData: 0,
      hourlyData: 0
    }
  });
})*/


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
  Counts.publish(this, 'coinsCount', CurrentData.find({
    "metrics.cap.btc": {
      $gt: 0
    }
  }));
  Counts.publish(this, 'coinsCount2', CurrentData.find({
  }));
});

/*
  provide enough details to render dependent coins at system page
 */
Meteor.publish('dependentCoins', function(system) {
  return CurrentData.find(CF.CurrentData.selectors.dependents(system), {
    fields: {
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
    _id: systemName
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
        "_id": s
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
    _id: "Bitcoin"
  }, {fields: {
    metrics: 1
  }})
});

Meteor.publish('avatars', function(uidArray) {
  if (!_.isArray(uidArray)) return this.ready();
  return Meteor.users.find({
    _id: {
      $in: uidArray
    }
  }, {
    fields: {
      'profile': 1,
      'avatar': 1,
      'username': 1,
    }
  });
});

/*
  user profile by username or id
 */
 var print = CF.Utils.logger.print;
Meteor.publish('userProfile', function(options){
  options = CF.Utils.normalizeOptionsPerUser(options);
  var uid = options.userId;

  var fields = {
    profile: 1,
    username: 1,
    avatar: 1,
    largeAvatar: 1,
    accounts: 1,
    createdAt: 1,
    'services.twitter.screenName': 1
  };
  var own = this.userId == uid;
  if (own) fields.accountsPrivate = 1;
  return Meteor.users.find({_id: uid}, {fields: fields});
});

/*
  support subscription for assets manager, loads info to display,
   currency links in portfolio, depends on list of systems
 */
Meteor.publish('assetsSystems', function(tokens) {
  return CurrentData.find(CF.CurrentData.selectors.system(tokens), {
    fields: {
      token: 1,
      aliases: 1,
      icon: 1,
      metrics: 1,
      calculatable: 1
    }
  })
});

/*
  loads systems data for portfolio
 */

Meteor.publish("portfolioSystems", function(options) {
  options = CF.Utils.normalizeOptionsPerUser(options);
  var userId = options.userId;

  var own = this.userId == userId;
  var user = Meteor.users.findOne({
    _id: userId
  });
  if (!user) return this.ready();
  var accounts = _.clone(user.accounts) || {};
  if (own) _.extend(accounts, user.accountsPrivate)

  var systems = CF.UserAssets.getSystemsFromAccountsObject(accounts);

  if (own) {
    if (user.profile && user.profile.starredSystems && user.profile.starredSystems.length) {
      systems = _.union(systems, user.profile.starredSystems)
    }
  }

  return CurrentData.find(CF.CurrentData.selectors.system(systems), {
    fields: {
      "aliases": 1,
      "metrics": 1,
      "token": 1,
      "icon": 1,
      "calculatable": 1
    }
  })
});
