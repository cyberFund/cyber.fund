
import cfRating from '/imports/api/cf/rating'
import {CurrentData} from '/imports/api/collections'
import {_session} from '/imports/api/client/utils/base'
var initialLimit = cfRating.limit0;
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
  };
}

var getSorterByKey = cfRating.getSorterByKey;
var getKeyBySorter = cfRating.getKeyBySorter;

Template["ratingTable"].onCreated(function() {
  var sort = (FlowRouter.getParam("sort") || "whales");
  if (sort) {
    _session.set ("coinSorter", getSorterByKey(sort));
  }

  Session.set("ratingPageLimit", initialLimit);

  var instance = this;
  instance.ready = new ReactiveVar();

    instance.subscribe("marketDataRP", {
      selector: tableSelector()
    });

    instance.subscribe("currentDataRP", {
      selector: tableSelector()
    });


  instance.autorun(function() {
    var key = getKeyBySorter(_session.get("coinSorter"));
    FlowRouter.withReplaceState(function() {
      FlowRouter.setParams({sort: key});
    });
    instance.ready.set(instance.ready.get() || instance.subscriptionsReady());
  });
});

Template["ratingTable"].onRendered (function() {
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
        recalcWidths();
        $thead.addClass("show");
      }
    } else {
      $thead.removeClass("show");
      $thead.css("width", "");
      $thead.find("th").each(function() {
        $(this).css("width", "");
      });
    }
  }, 200);

  $(window).scroll(t);
  $(window).resize(recalcWidths);
  $(window).trigger("resize");
});

Template["ratingTable"].helpers({
  rows: function() {
    var sort = _session.get("coinSorter");
    return CurrentData.find(tableSelector(), {
      sort: sort
    }).fetch();
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
    return true;//Template.instance().ready.get();
  }
});



Template["ratingTable"].events({
  "click .show-more": function(e, t) {
    var step = cfRatingstep;
    var limit = Session.get("ratingPageLimit");
    limit += step;
    analytics.track("Viewed Crap", {
      counter: (limit - initialLimit) / step
    });
    limit = Math.min(limit, Counts.get("coinsCount"));
    Session.set("ratingPageLimit", limit);
  },
  "click .no-click a": function() {
    return false;
  }
});
