function systemName() {
  return Blaze._globalHelpers._toS(Router.current().params.name_);
}

Template['systemBasic'].rendered = function () {

  $('.scrollspy').scrollSpy();
  var curDataDoc = this.data.curData.fetch()[0];
  if (curDataDoc && !curDataDoc.initializedAverages && curDataDoc._id) {
    Meteor.call("initAverageValues", curDataDoc._id);
  }
  $('ul.tabs').tabs();
  if (!CF.MarketData.graphTime.get()) CF.MarketData.graphTime.set("all");
  var t = this;
  Tracker.autorun(function () {
    t._system = t.data.curData.fetch()[0];
    Meteor.subscribe('avatars', t._system._usersStarred)
  })
};

Template['systemBasic'].helpers({
  'curData': function () {
    return CurrentData.findOne({
      system: systemName()
    });
  },
  'img_url': function () {
    return CF.Chaingear.helpers.cgSystemLogo(this);
  },
  'dependents': function () {
    return CurrentData.find(CF.CurrentData.selectors.dependents(systemName()), {sort: {system: 1}})
  },
  depends_on: function () {
    var self = this;
    if (!self.dependencies) return [];
    var deps = self.dependencies;
    if (!_.isArray(deps)) deps = [deps];
    return CurrentData.find(CF.CurrentData.selectors.dependencies(deps));
  },
  'dependentsExist': function () {
    return CurrentData.find(CF.CurrentData.selectors.dependents(systemName())).count();
  },
  'symbol': function () {
    return this.token ? this.token.token_symbol : ""
  },
  name_: function () {
    return Blaze._globalHelpers._toU(this.system);
  },
  hashtag: function () {
    return (this.descriptions && this.descriptions.hashtag) ? this.descriptions.hashtag.slice(1) : ""
  },
  existLinksWith: function (links, tag) {
    if (!_.isArray(links)) return false;
    return !!_.find(links, function (link) {
      return (_.isArray(link.tags) && link.tags.indexOf(tag) > -1);
    });
  },
  countWithTag: function (links, tag) {
    if (!_.isArray(links)) return 0;
    var f = _.filter(links, function (link) {
      return _.isArray(link.tags) && (link.tags.indexOf(tag) > -1);
    });
    return f.length;
  },
  independent: function (system) {
    var deps = system.dependencies;
    if (!deps) return true;
    if (!_.isArray(deps)) deps = [deps];
    return deps.indexOf('independent') > -1;
  },
  linksWithTag: function (links, tag) {
    if (!_.isArray(links)) return [];
    var f = _.filter(links, function (link) {
      return _.isArray(link.tags) && (link.tags.indexOf(tag) > -1);
    });
    return f;
  },
  mainTags: function () {
    return ['Wallet', "Exchange", "Analytics", "Magic"]
  },

  linksWithoutTags: function (links, tags) {
    if (!_.isArray(links)) return [];

    var f = _.filter(links, function (link) {
      var ret = _.isArray(link.tags);
      _.each(tags, function (tag) {
        if (link.tags.indexOf(tag) > -1) ret = false;
      });

      return ret;
    });

    return f;
  },
  dayToDayTradeVolumeChange: function () {
    var metrics = this.metrics;
    if (metrics.tradeVolumePrevious && metrics.tradeVolumePrevious.day) {
      return CF.Utils.deltaPercents(metrics.tradeVolumePrevious.day, metrics.tradeVolume);
    }
    return 0;
  },

  // todo: currently, those are using current price to estimate yesterday' trade volume.
  // not good. must be fixed soon.
  todayVolumeUsd: function () {
    if (this.metrics && this.metrics.tradeVolume && this.metrics.price) {
      return this.metrics.tradeVolume * this.metrics.price.usd / this.metrics.price.btc;
    }
    return 0;
  },
  yesterdayVolumeUsd: function () {
    var metrics = this.metrics;
    if (metrics && metrics.tradeVolumePrevious &&
      metrics.tradeVolumePrevious.day && metrics.price) {
      return metrics.price.usd / metrics.price.btc * metrics.tradeVolumePrevious.day;
    }
  },
  todayVolumeBtc: function () {
    if (this.metrics && this.metrics.tradeVolume && this.metrics.price) {
      return this.metrics.tradeVolume;
    }
    return 0;
  },
  yesterdayVolumeBtc: function () {
    var metrics = this.metrics;
    if (metrics && metrics.tradeVolumePrevious &&
      metrics.tradeVolumePrevious.day && metrics.price) {
      return metrics.tradeVolumePrevious.day;
    }
  },
  usdVolumeChange: function () {
    var metrics = this.metrics;
    if (metrics && metrics.tradeVolumePrevious &&
      metrics.tradeVolumePrevious.day && metrics.price
      && metrics.tradeVolume && metrics.price) {

      return CF.Utils.deltaPercents(metrics.price.usd / metrics.price.btc * metrics.tradeVolume,
        metrics.price.usd / metrics.price.btc * metrics.tradeVolumePrevious.day);
    }
  },
  btcVolumeChange: function () {
    var metrics = this.metrics;
    if (metrics && metrics.tradeVolumePrevious &&
      metrics.tradeVolumePrevious.day
      && metrics.tradeVolume) {

      return CF.Utils.deltaPercents(metrics.tradeVolume,
        metrics.tradeVolumePrevious.day);
    }
  },
  main_links: function () {
    if (!this.links || !_.isArray(this.links)) {
      return [];
    }

    return _.first(_.filter(this.links, function (link) {
      return (link.tags && _.isArray(link.tags) && link.tags.indexOf("Main") > -1)
    }), 4);
  },
  hasSpecs: function () {
    return (this.specs && !_.isEmpty(this.specs));
  },
  ___join: function (k1, k2) {
    return k1 + "_" + k2;
  },
  selectedGraph: function (key) {
    return CF.MarketData.graphTime.get() == key ? "orange" : "";
  },
  systemIsStarredColor: function () {
    var ret = false;
    var user = Meteor.user();
    if (user && user.profile && user.profile.starredSystems) {
      ret = user.profile.starredSystems.indexOf(this.system) > -1;
    }
    return ret ? 'yellow' : 'grey';
  },
  usersStarred: function(){
    var uS = this._usersStarred;
    return Meteor.users.find({_id: {$in: uS}});
  }
});

Template['systemBasic'].events({
  'click #charts-ctl a.btn.act': function (e, t) {
    var val = $(e.currentTarget).data("span");
    CF.MarketData.graphTime.set(val);
    analytics.track('buttonClick', {
      section: 'graphs',
      role: 'timespan select',
      value: val
    })
  },
  'click #charts-ctl a.btn.mock': function (e, t) {
    var val = $(e.currentTarget).data("span");
    Materialize.toast('Coming soon!', 2500);
    analytics.track('buttonClick', {
      section: 'graphs',
      role: 'timespan select',
      value: val
    })
  },
  'click .btn-star-system': function (e, t) {
    if (!Meteor.user()) return;
    Meteor.call('toggleStarSys', t._system.system);
  }
});

Template['systemBasic'].onCreated(function () {
  var instance = this;

  instance.autorun(function () {
    instance.subscribe('dependentCoins', systemName());
    var data = instance._system;
    if (data && data.dependencies) {
      var d = data.dependencies;
      if (!_.isArray(d)) d = [d];
      if (d.indexOf("independent") == -1) instance.subscribe('dependencies', d);
    }
  });
});


