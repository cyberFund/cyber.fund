var cfCDs = CF.CurrentData.selectors;

function systemName() {
  return Blaze._globalHelpers._toSpaces(FlowRouter.getParam('name_'));
}

function curData() {
  return CurrentData.findOne({
    _id: systemName()
  });
}

Template['systemBasic'].onCreated(function() {
  var instance = this;
  instance.ready = new ReactiveVar();
  instance.autorun(function() {
    var handle = CF.SubsMan.subscribe('systemData', {
      name: systemName()
    });
    instance.ready.set(instance.ready.get() || handle.ready());
    instance.subscribe('dependentCoins', systemName());

    var data = curData();

    if (data && data.dependencies) {
      var d = data.dependencies;
      if (!_.isArray(d)) d = [d];
      if (d.indexOf("independent") == -1) {
        instance.subscribe('dependencies', d);
      }
    }
  });
})

Meteor.startup(function() {
  CF.keenflag = new ReactiveVar();
  Keen.ready(function() {
    CF.keenflag.set(true);
  });
})

Template['systemBasicKeen'].onRendered(function() {
  var instance = this;
  var client = new Keen({
    projectId: "55c8be40d2eaaa07d156b99f",
    readKey: "4083b4d7a1ce47a40aabf59102162e3848d0886d457e4b9b57488361edfa28a1e49d2b100b6008299aa38303cd6254d4aa993db64137675d9d8d65928f283573c3932f413ec06050e8e3e9a642485cb6090d742d84da78f247aeb05f709e69f6c2085e9324a277e654bb12434f094412"
  });

  instance.autorun(function() {
    console.log("0")
    if (!CF.keenflag.get()) return;
    console.log("1")
    var key = FlowRouter.getParam("name_");
    if (!key) return;
    // Create a query instance

    var count = new Keen.Query("count", {
      eventCollection: "Viewed System Page",
      filters: [{
        "operator": "contains",
        "property_name": "path",
        "property_value": key
      }],
      interval: "daily",
      timeframe: "this_21_days"
    });

    console.log("2", key)

    // Basic charting w/ `client.draw`:
    client.draw(count, document.getElementById("keen-chart"), {
      chartType: "columnchart",
      title: "Page Visits",
      label: 'test'
    });
  })
})

Template['systemBasicUsersStarred'].onCreated(function() {
  var instance = this;

  instance.autorun(function() {
    var data = curData();
    if (data) {
      instance.subscribe('avatars', data._usersStarred);
    }
  });
});


Template['systemBasic'].onRendered(function() {
  $('.scrollspy').scrollSpy();
  var curDataDoc = curData();
  /*  if (curDataDoc && !curDataDoc.initializedAverages && curDataDoc._id) {
      Meteor.call("initAverageValues", curDataDoc._id);
    } */
});

Template['systemBasic'].helpers({
  anyCards: function(){
    if (!this.metrics) return false;
    return this.metrics.tradeVolume || this.metrics.supply ||
    (this.metrics.price && (this.metrics.price.usd || this.metrics.price.btc || this.metrics.price.eth)) ||
    (this.metrics.cap && (this.metrics.cap.usd || this.metrics.cap.btc || this.metrics.cap.eth ))
  },
  systemName: function() {
    return systemName()
  },
  subReady: function() {
    return Template.instance().ready.get();
  },
  curData: function() {
    return curData();
  },

  dependents: function() {
    return CurrentData.find(cfCDs.dependents(systemName()), {
      sort: {
        _id: 1
      }
    })
  },

  depends_on: function() {
    var self = curData();
    if (!self.dependencies) return [];
    var deps = self.dependencies;
    if (!_.isArray(deps)) deps = [deps];
    return CurrentData.find(cfCDs.dependencies(deps));
  },

  dependentsExist: function() {
    return CurrentData.find(cfCDs.dependents(systemName())).count();
  },

  symbol: function() {
    return this.token ? this.token.symbol : ""
  },

  hashtag: function() {
    return (this.descriptions && this.descriptions.hashtag) ? this.descriptions.hashtag.slice(1) : ""
  },
  existLinksWith: function(links, tag) {
    if (!_.isArray(links)) return false;
    return !!_.find(links, function(link) {
      return (_.isArray(link.tags) && link.tags.indexOf(tag) > -1);
    });
  },

  mainTags: function() {
    return ['Wallet', "Exchange", "Analytics", "Magic"]
  },

  linksWithoutTags: function(links, tags) {
    if (!_.isArray(links)) return [];

    return _.filter(links, function(link) {
      var ret = _.isArray(link.tags);
      _.each(tags, function(tag) {
        if (link.tags.indexOf(tag) > -1) ret = false;
      });

      return ret;
    });
  },

  isProject: function() {
    return this.descriptions && this.descriptions.state == 'Project'
  },

  // todo: currently, those are using current price to estimate yesterday' trade volume.
  // not good. must be fixed.
  todayVolumeUsd: function() {
    if (this.metrics && this.metrics.tradeVolume && this.metrics.price) {
      return this.metrics.tradeVolume * this.metrics.price.usd / this.metrics.price.btc;
    }
    return 0;
  },
  yesterdayVolumeUsd: function() {
    var metrics = this.metrics;
    if (metrics && metrics.tradeVolumePrevious &&
      metrics.tradeVolumePrevious.day && metrics.price) {
      return metrics.price.usd / metrics.price.btc * metrics.tradeVolumePrevious.day;
    }
  },
  todayVolumeBtc: function() {
    if (this.metrics && this.metrics.tradeVolume && this.metrics.price) {
      return this.metrics.tradeVolume;
    }
    return 0;
  },
  yesterdayVolumeBtc: function() {
    var metrics = this.metrics;
    if (metrics && metrics.tradeVolumePrevious &&
      metrics.tradeVolumePrevious.day && metrics.price) {
      return metrics.tradeVolumePrevious.day;
    }
  },
  usdVolumeChange: function() {
    var metrics = this.metrics;
    if (metrics && metrics.tradeVolumePrevious &&
      metrics.tradeVolumePrevious.day && metrics.price && metrics.tradeVolume && metrics.price) {

      return CF.Utils.deltaPercents(metrics.price.usd / metrics.price.btc * metrics.tradeVolume,
        metrics.price.usd / metrics.price.btc * metrics.tradeVolumePrevious.day);
    }
  },
  btcVolumeChange: function() {
    var metrics = this.metrics;
    if (metrics && metrics.tradeVolumePrevious &&
      metrics.tradeVolumePrevious.day && metrics.tradeVolume) {

      return CF.Utils.deltaPercents(metrics.tradeVolume,
        metrics.tradeVolumePrevious.day);
    }
  },
  main_links: function() {
    if (!this.links || !_.isArray(this.links)) {
      return [];
    }

    return _.first(_.filter(this.links, function(link) {
      return (link.tags && _.isArray(link.tags) && link.tags.indexOf("Main") > -1)
    }), 4);
  },
  ___join: function(k1, k2) {
    return k1 + "_" + k2;
  },
  systemIsStarredColor: function() {
    var ret = false;
    var user = Meteor.user();
    if (user && user.profile && user.profile.starredSystems) {
      ret = user.profile.starredSystems.indexOf(this._id) > -1;
    }
    return ret ? 'yellow' : 'grey';
  },
  dailyData: function() {
    var _id = this._id;
    return FastData.find({
      systemId: _id
    }, {
      sort: {
        timestamp: 1
      }
    })
  }
});

Template['systemBasicAbout'].helpers({
  independent: function(system) {
    var deps = system.dependencies;
    if (!deps) return true;
    if (!_.isArray(deps)) deps = [deps];
    return deps.indexOf('independent') > -1;
  }
})

Template['systemBasicHeadline'].helpers({
  countWithTag: function(links, tag) {
    if (!_.isArray(links)) return 0;
    var f = _.filter(links, function(link) {
      return _.isArray(link.tags) && (link.tags.indexOf(tag) > -1);
    });
    return f.length;
  }
});

Template['systemBasic'].events({

  'click .btn-star-system': function(e, t) {
    var user = Meteor.user();
    if (!user) FlowRouter.go('/welcome'); //return;
    var system = t.$(e.currentTarget).attr("system-name");
    var exists = user && user.profile && user.profile.starredSystems &&
      _.contains(user.profile.starredSystems, system);
    analytics.track(exists ? 'Unfollowed System' : 'Followed System', {
      systemName: system
    });

    Meteor.call('toggleStarSys', system);
  }
});

Template['systemBasicCharts'].onCreated(function() {
  var instance = this;
  instance.subscribe('fastData', systemName());
});

Template['systemBasicCharts'].helpers({
  selectedGraph: function(key) {
    return CF.MarketData.graphTime.get() === key ? "orange" : "green";
  },
  _selectedGraph: function(key) {
    return CF.MarketData.graphTime.get() === key
  },
})

Template['systemBasicCharts'].events({
  'click #charts-ctl a.btn.act': function(e, t) {
    var val = t.$(e.currentTarget).data("span");
    CF.MarketData.graphTime.set(val);
    analytics.track('Discovered Charts', {
      section: 'graphs',
      role: 'timespan select',
      value: val
    })
  },
  'click #charts-ctl a.btn.mock': function(e, t) {
    var val = t.$(e.currentTarget).data("span");
    Materialize.toast('Coming soon!', 2500);
    analytics.track('Discovered Charts', {
      section: 'graphs',
      role: 'timespan select',
      value: val
    })
  },
});
