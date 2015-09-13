var initialLimit = CF.Rating.limit0;

/*var subs = new SubsManager({
 // maximum number of cache subscriptions
 cacheLimit: 10,
 // any subscription will be expire after 5 minute, if it's not subscribed again
 expireIn: 5
 });*/

Template['ratingTable'].onCreated(function () {
  var self = this;
  this.limit = new ReactiveVar();
  this.sort = new ReactiveVar();
  this.limit.set(initialLimit);
  this.sort.set(CF.Rating.sorter0);
  this.sub = {};
  this.subState = {};

  //self.autorun(function () {
  var limit = self.limit.get();
  var sort = self.sort.get();
  self.sub['data'] = Meteor.subscribe("currentDataRP",
    {
      limit: limit,
      sort: sort
    })
  //});
});

Template['ratingTable'].onRendered (function () {
  var self = this;
  var $thead = $("#fixed-thead");
  var $thead0 = $("#normal-thead");

  function recalcWidths() {
    var widths = [];
    $thead0.find("th").each(function (i, el) {
      widths[i] = $(el).innerWidth();
    });
    $thead.find("th").each(function (i, el) {
      $(el).css("width", widths[i] + "px");
    });
  }

  var t = _.throttle(function () {
    if (!self.sub['data'].ready()) return;
    var $w = $(window);
    var scrolltop = $w.scrollTop();
    if (scrolltop > 0 && scrolltop < ($("#rating-table").height() - $w.height() + 400)) {
      if (!$thead.hasClass("show")) {
        //$thead.css("height", $thead0.height()+"px");
        recalcWidths()
        $thead.addClass("show");
      }
    } else {
      $thead.removeClass("show");
      $thead.css("width", '');
      $thead.find("th").each(function () {
        $(this).css("width", '');
      });
    }
  }, 400);

  $(window).scroll(t);
  $(window).resize(recalcWidths);
  $(window).trigger("resize");
});
/*
 Template['ratingTable'].onDestroyed(function () {
 if (this.sub['data'] && _.isFunction(this.sub['data'].stop)) {
 this.sub['data'].stop();
 }
 })
 */
Template['ratingTable'].helpers({
  'rows': function () {
    var sort = Template.instance().sort.get();
    var limit = Template.instance().limit.get();
    if (!_.isObject(sort)) sort = CF.Rating.sorter0;
    if (isNaN(limit)) limit = CF.Rating.limit0;
    if (sort["ratings.rating_cyber"]) {
      sort["metrics.cap.btc"] = sort["ratings.rating_cyber"];
    }
    return CurrentData.find({}, {sort: sort, limit: limit});
  },
  scrolloo: function () {
    var scrolltop = $(window).scrollTop();
    return scrolltop + 'px';
  },
  tradeVolumeUsd: function () {
    var vB = this.metrics.tradeVolume, btcPrice = 0,
      btc = CurrentData.findOne({system: "Bitcoin"});
    if (btc && btc.metrics) btcPrice = btc.metrics.price.usd;
    return vB * btcPrice;
  },
  'img_url': function () {
    return CF.Chaingear.helpers.cgSystemLogo(this);
  },
  symbol: function () {
    if (this.token && this.token.token_symbol) {
      return this.token.token_symbol
    }
    //console.log("not found symbol for `" + this.system + '` system');
    return "";
  },
  // underscored currency name
  name_: function () {
    return Blaze._globalHelpers._toU(this.system);
  },
  dailyTradeVolumeToText: function (volumeDaily, absolute) {
    //<0.1% - Illiquid
    //<0.3% - Very Low
    //< 0.5% - Low
    //< 1% - Normal
    //< 2% - High
    //`> 3% - Very High (edited)

    if (!absolute) {
      return "Normal";
    }

    if (Math.abs(volumeDaily / absolute) < 0.001) return "Illiquid";
    if (Math.abs(volumeDaily / absolute) < 0.003) return "Very Low";
    if (Math.abs(volumeDaily / absolute) < 0.005) return "Low";
    if (Math.abs(volumeDaily / absolute) < 0.01) return "Normal";
    if (Math.abs(volumeDaily / absolute) < 0.025) return "High";
    return "Very High";


  },
  capBtcToText: function (cap) {
    var ret = parseFloat(cap);
    if (isNaN(ret)) return "";
    return Blaze._globalHelpers.readableNumbers(ret.toFixed(0));
  },
  capUsdToText: function (cap) {
    var ret = parseFloat(cap);
    if (isNaN(ret)) return "";
    return Blaze._globalHelpers.readableNumbers(ret.toFixed(0));
  },
  capToText: function (cap) {
    var ret = parseFloat(cap);
    if (isNaN(ret)) return "";
    return Blaze._globalHelpers.readableNumbers(ret.toFixed(0));
  },
  hasMore: function () {
    return Counts.get("coinsCounter") > Template.instance().limit.get();
  },
  tradeVolumeOk: function (tv) {
    return tv && (tv >= 0.2);
  },
  turnover: function () {
    var metrics = this.metrics;
    if (metrics.cap && metrics.cap.btc) {
      return 100.0 * metrics.turnover;
    }
    return 0;
  },
  dayToDayTradeVolumeChange: function () {
    var metrics = this.metrics;
    if (metrics.tradeVolumePrevious && metrics.tradeVolumePrevious.day) {
      return 100.0 * (metrics.tradeVolume - metrics.tradeVolumePrevious.day) / metrics.tradeVolume;
    }
    return 0;
  },
  sorter: function (field) {
    var sorter = Template.instance().sort.get();
    if (!_.isObject(sorter)) return ''
    if (sorter[field] == -1) return "↓ ";
    if (sorter[field] == 1) return "↑ ";
    return "";
  },
  isReady: function (key) {
    var sub = Template.instance().sub;
    if (sub[key] && _.isFunction(sub[key].ready)) {
      return sub[key].ready();
    }
    console.log("isReady helper for " + key + " key found no suitable subscription")
    return false;
  }
});

Template['ratingTable'].events({
  'click .show-more': function (e, t) {
    var step = CF.Rating.step;
    var limit = t.limit.get();
    limit += step;
    analytics.track("Viewed Crap",
      {
        counter: (limit - initialLimit) / step
      });
    limit = Math.min(limit, Counts.get("coinsCounter"))
    t.limit.set(limit);
    var sort = t.sort.get();
    //t.sub['data'].stop();
    t.sub['data'] = Meteor.subscribe("currentDataRP",
      {
        limit: limit,
        sort: sort
      })
  },
  'click .no-click a': function () {
    Materialize.toast("Coming soon!", 3000);
    return false;
  },
  'click th.sorter': function (e, t) {
    var newSorter = $(e.currentTarget).data('sorter');
    var sort = t.sort.get();
    sort = sort || {};
    if (sort[newSorter]) {
      sort[newSorter] = -sort[newSorter];
    } else {
      sort = {};
      sort[newSorter] = -1;
    }
    t.sort.set(sort);
    var limit = t.limit.get();
    t.sub['data'].stop();
    t.sub['data'] = Meteor.subscribe("currentDataRP",
      {
        limit: limit,
        sort: sort
      })
  }
});
