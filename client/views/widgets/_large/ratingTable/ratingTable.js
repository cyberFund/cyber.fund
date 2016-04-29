var initialLimit = CF.Rating.limit0;

function tableSelector() {
  return {
    "flags.rating_do_not_display": {
      $ne: true
    },
    "calculatable.RATING.sum": {
      $gte: 1
    },
    "metrics.tradeVolume": {
      $gte: 0.2
    }
  }
}

// todo move to triggers
var sorters = {
  "metrics.supplyChangePercents.day": {
    "inflation": -1,
    "deflation": 1
  },
  "metrics.turnover": {
    "active": -1,
    "passive": 1
  },
  "calculatable.RATING.vector.GR.monthlyGrowthD": {
    "profit": -1,
    "loss": 1
  },
  "calculatable.RATING.vector.GR.months": {
    "mature": -1,
    "young": 1
  },
  "metrics.cap.btc": {
    "whales": -1,
    "dolphins": 1
  },
  "metrics.cap.usd": {
    "whales": -1,
    "dolphins": 1
  },
  "metrics.capChangePercents.day.usd": {
    "bulls": -1,
    "bears": 1
  },
  "calculatable.RATING.vector.LV.num": {
    "love": -1,
    "hate": 1
  },
  "calculatable.RATING.sum": {
    "leaders": -1,
    "suckers": 1
  }
}

function getKeyBySorter(sorterobj){
  var ret = null
  var key = _.keys(sorterobj).length && _.keys(sorterobj)[0];
  if (!key) return ret;
  var value = sorterobj[key];
  var obj = sorters[key];
  if (!obj) return ret;
  _.each(obj, function(v, k){
    if (v == value) ret = k;
  });
  return ret;
}

function getSorterByKey(key){
  var ret = {}
  _.each(sorters, function(sorter, sorterKey){
    _.each(sorter, function(v, k){
      if (k == key) ret[sorterKey] = v;
    })
  })
  return ret
}

Template['ratingTable'].onCreated(function() {
  var sorter = FlowRouter.getParam('sort');
  if (sorter && getSorterByKey(sorter) && _.keys(getSorterByKey(sorter)).length ) {
    _Session.set('coinSorter', getSorterByKey(sorter));
  }

  Session.set('ratingPageLimit', initialLimit);
  var instance = this;
  instance.ready = new ReactiveVar();
  var selector = tableSelector()
  if (_.keys(_Session.get('coinSorter')).length)
    selector[_.keys(_Session.get('coinSorter'))[0]] = {
      $exists: true
    }
  instance.autorun(function() {
    CF.subs.MarketData = instance.subscribe("marketDataRP", {
      selector: selector
    });
  })

  instance.autorun(function() {
    var key = getKeyBySorter(_Session.get('coinSorter'));
    FlowRouter.setParams({sort: key})

    var handle = CF.SubsMan.subscribe("currentDataRP", {
      /*limit: Session.get('ratingPageLimit'),
      sort: _Session.get('coinSorter'),*/
      selector: tableSelector()
    });
    instance.ready.set(instance.ready.get() || handle.ready());
  });
});

Template['ratingTable'].rendered = function() {
  var $thead = $("#fixed-thead");
  var $thead0 = $("#normal-thead");

  function recalcWidths() {
    var widths = [];
    $thead0.find("th").each(function(i, el) {
      widths[i] = $(el).innerWidth();
    });
    $thead.find("th").each(function(i, el) {
      $(el).css("width", widths[i] + "px");
    });
  }

  var t = _.throttle(function() {
    var $w = $(window);
    var scrolltop = $w.scrollTop();
    if (scrolltop > 55 && scrolltop < ($("#rating-table").height() - $w.height())) {
      if (!$thead.hasClass("show")) {
        //$thead.css("height", $thead0.height()+"px");
        recalcWidths()
        $thead.addClass("show");
      }
    } else {
      $thead.removeClass("show");
      $thead.css("width", '');
      $thead.find("th").each(function() {
        $(this).css("width", '');
      });
    }
  }, 200);

  $(window).scroll(t);
  $(window).resize(recalcWidths);
  $(window).trigger("resize");
};

Template['ratingTable'].helpers({
  'rows': function() {
    var sort = _Session.get("coinSorter");
    if (sort["ratings.rating_cyber"]) {
      sort["metrics.cap.btc"] = sort["ratings.rating_cyber"];
    }
    return CurrentData.find(tableSelector(), {
      sort: sort
    });
  },
  'img_url': function() {
    return CF.Chaingear.helpers.cgSystemLogo(this);
  },


  capBtcToText: function(cap) {
    var ret = parseFloat(cap);
    if (isNaN(ret)) return "";
    return Blaze._globalHelpers.readableNumbers(ret.toFixed(0));
  },
  capUsdToText: function(cap) {
    var ret = parseFloat(cap);
    if (isNaN(ret)) return "";
    return Blaze._globalHelpers.readableNumbers(ret.toFixed(0));
  },
  capToText: function(cap) {
    var ret = parseFloat(cap);
    if (isNaN(ret)) return "";
    return Blaze._globalHelpers.readableNumbers(ret.toFixed(0));
  },
  subReady: function() {
      return Template.instance().ready.get();
    }
    /*,
      hasMore: function () {
        return Counts.get("coinsCounter") > Session.get('ratingPageLimit');
      }*/
});



Template['ratingTable'].events({
  'click .show-more': function(e, t) {
    var step = CF.Rating.step;
    var limit = Session.get("ratingPageLimit");
    limit += step;
    analytics.track("Viewed Crap", {
      counter: (limit - initialLimit) / step
    });
    limit = Math.min(limit, Counts.get("coinsCounter"))
    Session.set("ratingPageLimit", limit);
  },
  'click .no-click a': function() {
    return false;
  }
});
