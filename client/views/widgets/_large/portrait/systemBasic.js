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

  instance.subscribe('dependentCoins', systemName());

  instance.autorun(function() {

    var data = curData();

    if (data && data.dependencies) {
      var d = data.dependencies;
      if (!_.isArray(d)) d = [d];
      if (d.indexOf("independent") == -1) {
        instance.subscribe('dependencies', d);
      }
    }
  });
});


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
  if (curDataDoc && !curDataDoc.initializedAverages && curDataDoc._id) {
    Meteor.call("initAverageValues", curDataDoc._id);
  }
});

Template['systemBasic'].helpers({
  'curData': function() {
    return curData();
  },

  'dependents': function() {
    return CurrentData.find(CF.CurrentData.selectors.dependents(systemName()), {
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
    return CurrentData.find(CF.CurrentData.selectors.dependencies(deps));
  },

  'dependentsExist': function() {
    return CurrentData.find(CF.CurrentData.selectors.dependents(systemName())).count();
  },

  'symbol': function() {
    return this.token ? this.token.token_symbol : ""
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
  img_url: function() {
    return CF.Chaingear.helpers.cgSystemLogo(curData());
  },

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

Template['systemBasicCharts'].onCreated(function(){
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
