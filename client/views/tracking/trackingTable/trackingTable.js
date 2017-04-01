import {CurrentData, Extras} from '/imports/api/collections'
import {getSorterByKey, getKeyBySorter} from '/imports/api/cf/rating'
import {readableNumbers, _session} from '/imports/api/client/utils/base'
var initialLimit = cfRating.limit0;
function tableSelector() {
  return {
    "flags.rating_do_not_display": {
      $ne: true
    }
  };
}

Template["trackingWidget"].onCreated(function () {
  var instance = this;
  var selector = tableSelector();

  instance.subscribe("maxLove");
  var sort = (FlowRouter.getParam("sort") || "whales");
  if (sort) {
    _session.set ("coinSorter", getSorterByKey(sort));
  }
  console.log('0000')
  instance.subscribe("currentDataRP", {
    selector: tableSelector(), sort: getSorterByKey(sort)
  }, {onReady: function(){
    console.log(1111)
    instance.subscribe("marketDataRP", {
      selector: tableSelector()
    }, {onReady: function(){
      Session.set("qcMarketDataReady", true)
    }});
  }});

  instance.autorun(function() {
    var key = getKeyBySorter(_session.get("coinSorter"));
    FlowRouter.withReplaceState(function() {
      FlowRouter.setParams({sort: key});
    });
  });
});

Template["trackingWidget"].onRendered ( function () {
  Session.set("ratingPageLimit", 30);
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
    var $w = $(window);
    var scrolltop = $w.scrollTop();
    if (scrolltop > 55 && scrolltop < ($("#tracking-table").height() - $w.height() )) {
      if (!$thead.hasClass("show")) {
        //$thead.css("height", $thead0.height()+"px");
        recalcWidths();
        $thead.addClass("show");
      }
    } else {
      $thead.removeClass("show");
      $thead.css("width", "");
      $thead.find("th").each(function () {
        $(this).css("width", "");
      });
    }
  }, 200);

  $(window).scroll(t);
  $(window).resize(recalcWidths);
  $(window).trigger("resize");
});

Template["trackingWidget"].helpers({
  _wl_cs: function(){
    var c = this.metrics && this.metrics.cap && this.metrics.cap.usd || 0;
    var k = 1000, M = 1000000;
    if (c < 10*k) return 0;
    if (c < 100*k) return 0.1;
    if (c < 1*M) return 0.2;
    if (c < 10*M) return 0.3;
    if (c < k*M) return 0.4;
    return 0.5;
  },
  _lv: function(){
    if (!this._usersStarred || !this._usersStarred.length) return 0;

    var maxLove = Extras.findOne({_id: "maxLove"});
    if (maxLove) {
      maxLove = maxLove.value;
    }
    else {
      return 0;
    }

    return this._usersStarred.length / maxLove;
  },
  _gr: function(){
    return 0;
  },
  firstPrice: function(){
    return this.first_price || {  };
  },
  rows: function () {
    var sort = _session.get("coinSorter");
    return CurrentData.find({}, {sort: sort}).fetch();
  },
  symbol: function () {
    if (this.token && this.token.symbol) {
      return this.token.symbol;
    }
    return "";
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
  }/*,
  hasMore: function () {
    return Counts.get("coinsCount") > Session.get('ratingPageLimit');
  }*/,
  subReady: function(){
    return Template.instance().ready.get();
  }
});

Template["trackingWidget"].events({
  "click .show-more": function (e, t) {
    var step = cfRating.step;
    var limit = Session.get("ratingPageLimit");
    limit += step;
    analytics.track("Viewed Crap",
      {
        counter: (limit - initialLimit) / step
      });
    limit = Math.min(limit, Counts.get("coinsCount"));
    Session.set("ratingPageLimit", limit);
  },
  "click .no-click a": function () {
    return false;
  }
});
