import {normalizeOptionsPerUser} from '/imports/api/utils/index'
import {CurrentData, FastData, Metrics, Extras, AcountsHistory, MarketData} from '/imports/api/collections'
import cfCDs from '/imports/api/currentData/selectors'
import {findByRefId} from '/imports/api/cf/accounts/utils'
import {getSystemsFromAccountsObject} from '/imports/api/cf/userAssets/utils'

import Acounts from '/imports/api/collections/Acounts'
/**
 * currentData, just fields enough to draw rating table..
 */
Meteor.publish("currentDataRP", function({selector={}, sort}) {
  var options = {}
  if (sort) options.sort = sort
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
    "first_price": 1
  };
  return CurrentData.find(selector, options);
});

Meteor.publish("marketDataRP", function({selector = {}}) {
  var list = _.pluck(CurrentData.find(selector, {fields: {_id: 1}}).fetch(), "_id");

  function intervalSelector(){
    return Meteor.settings.public && Meteor.settings.public.manyData ?
     "hourly" : "daily";
  }
  var date = moment.utc().subtract(30, "days").startOf("day").toDate();

  return MarketData.find({
    systemId: {$in: list},
    timestamp: {$gte: date },
    interval: intervalSelector()}); // 'daily' ! remove this, stick to daily everywhere, was only for dev
});

/* own user details */
Meteor.publish("userDetails", function() {
  return Meteor.users.find({
    _id: this.userId
  }, {
    fields: {
      "services.privateAccountsEnabled": 1,
      "services.twitter": 1, //userHasPublicAccess needs it...
      "username": 1,
      "avatar": 1,
      "largeAvatar": 1,
      "firstLogin": 1,
      "profile": 1
    }
  });
});

Meteor.publish("ownAssets", function(){
  let p = this
  if (!this.userId) return this.ready();
  return Acounts.find({refId:p.userId});
});
/**
 * fetch full currentData document
 */
Meteor.publish("systemData", function({name}) {
  console.log ("requested system "+ name);
  if (name) {
    return CurrentData.find(cfCDs.system(name));
  }
  return this.ready();
});


/*
  fetch systems that are displayed at radar page.
 */
Meteor.publish("crowdsalesAndProjectsList", function() {
  var doc = Extras.findOne({_id: "radarList"});
  if (!doc) return this.ready();
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
});

Meteor.publish("crowdsalesActive", function() {
  var doc = Extras.findOne({_id: "radarList"});
  if (!doc) return this.ready();
  var ids = _.union(doc.crowdsales || [], doc.projects || []);
  return CurrentData.find({
    _id: {$in: ids},
    "crowdsales.end_date": {
      $gt: new Date()
    },
    "crowdsales.start_date": {
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
  var sel = cfCDs.projects();
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
  Counts.publish(this, "usersCount", Meteor.users.find());
})

/*
  needed to know are there systems left, or we subscribed with limit >=
  number of coins. i.e. allows to hide button "show more systems" when there s nothing left
 */
Meteor.publish("coinsCount", function() {
  Counts.publish(this, "coinsCount", CurrentData.find({
    "metrics.cap.btc": {
      $gt: 0
    }
  }))
})

/*
  provide enough details to render dependent coins at system page
 */
Meteor.publish("dependentCoins", function(system) {
  return CurrentData.find(cfCDs.dependents(system), {
    fields: {
      "icon": 1,
      "dependencies": 1,
      "aliases": 1,
      "token": 1
    }
  })
})

/*
  provides data to draw daily chart
   - this currently is stored apart from CurrentData documents
 */
Meteor.publish("fastData", function(systemName) {
  var _id = CurrentData.findOne({
    _id: systemName
  });
  if (!_id) return this.ready();
  _id = _id._id;
  return FastData.find({
    systemId: _id
  })
})

/*
 provides details on coins   that current coin depends on . accepts
 list of system names
 */
Meteor.publish("dependencies", function(deps) {
  return CurrentData.find(cfCDs.dependencies(deps), {
    fields: {
      "icon": 1,
      "dependencies": 1,
      "aliases": 1,
      "token": 1
    }
  })
})

/*
  provides means for autocomplete to work
 */
Meteor.publish("search-sys", function(selector, options, collname) {
  var s = selector["token.name"];
  if (s) {
    selector = {
      $or: [{
        "token.symbol": s
      }, {
        "_id": s
      }, {
        "aliases.nickname": s
      }, {
        "token.name": s
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
  this.ready()
})

Meteor.publish("avatars", function(uidArray) {
  if (!_.isArray(uidArray)) return this.ready();
  return Meteor.users.find({
    _id: {
      $in: uidArray
    }
  }, {
    fields: {
      "profile": 1,
      "avatar": 1,
      "username": 1
    }
  })
})

/*
  user profile by username or id
 */
Meteor.publish("userProfile", function(options){
  options = normalizeOptionsPerUser(options);
  var uid = options.userId;

  var fields = {
    profile: 1,
    username: 1,
    avatar: 1,
    largeAvatar: 1,
    accounts: 1,
    createdAt: 1,
    "services.twitter.screenName": 1
  };
  var ret = [];
  ret.push (Meteor.users.find({_id: uid}, {fields: fields}));
  ret.push (Acounts.find({refId:uid, isPrivate: {$ne: true}}) );
  return ret; // for own accounts  - already subscribed at 'userDetails' ;
});

Meteor.publish('accountsHistoryIndexForUser', function(options){
  if (!options.userId) return this.ready();
  let private = this.userId == userId;
  let selector = {
    type: 'index',
    refId: options.userId
  }
  let fields = {}
  if (!private) fields.full = 0
  return AcountsHistory.find(selector, {fields: fields})
});


Meteor.publish('accountsHistoryDetailsForUser', function(options){
  if (!options.userId) return this.ready();
  let private = this.userId == userId;
  let selector = {
    refId: options.userId
  }
  if (!options.name) selector.name = options.name
  else selector.name = {$exists: true} // don t take index entries

  if (!private) selector.isPrivate = {$ne: true}
  return AcountsHistory.find(selector)
})

/*
  support subscription for assets manager, loads info to display,
   currency links in portfolio, depends on list of systems
 */
Meteor.publish("assetsSystems", function(tokens) {
  return CurrentData.find(cfCDs.system(tokens), {
    fields: {
      token: 1,
      aliases: 1,
      icon: 1,
      metrics: 1,
      calculatable: 1
    }
  })
})

/*
  loads systems data for portfolio
 */
Meteor.publish("portfolioSystems", function(options) {
  options = normalizeOptionsPerUser(options);
  var userId = options.userId;

  var private = this.userId == userId;
  if (!userId) return this.ready();
  var user = Meteor.users.findOne({_id: userId});

  var accounts = findByRefId(userId, {private: private});
  var systems = getSystemsFromAccountsObject(accounts);

  if (private) {
    if (user.profile && user.profile.starredSystems && user.profile.starredSystems.length) {
      systems = _.union(systems, user.profile.starredSystems);
    }
  }

  return CurrentData.find(cfCDs.system(systems), {
    fields: {
      "aliases": 1,
      "metrics": 1,
      "token": 1,
      "icon": 1,
      "calculatable": 1
    }
  });
});

Meteor.publish("systemsLookup", function(){
  return CurrentData.find({}, {
    fields: {
      "token": 1,
      "icon": 1,
      "system": 1
    }
  });
});

Meteor.publish("usersWithFunds", function(){
  const selector = require("/imports/api/userFunds/").selector
  const user = Meteor.users.findOne({_id:this.userId});
  let ids = user && user.profile && user.profile.followingUsers || [];
  ids.push(this.userId);

  let fullSelector = this.userId ? {$or:[{_id: ids}, selector]} : selector;
  return Meteor.users.find(fullSelector, {
    fields: {
      profile: 1,
      avatar: 1,
      username: 1,
      publicFunds: 1,
      publicFundsUsd: 1
    }
  });
});

import dailyPrices from '/imports/api/vetalPrices/collection'

Meteor.publish("dailyPrices", function(options) {
   return dailyPrices.find()
})

require("/imports/api/vwap/publications")
