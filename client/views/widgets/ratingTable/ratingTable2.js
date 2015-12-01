var initialLimit = CF.Rating.limit0;
Meteor.startup(function () {
  _Session.default("ratingPageSort", {"metrics.cap.btc": -1});
});

Template['ratingTable2'].onCreated(function () {
  var instance = this;
  instance.autorun(function () {
    instance.subscribe("currentDataRP", {
      limit: Session.get('ratingPageLimit'),
      sort: _Session.get('ratingPageSort')
    });
  });

});

Template['ratingTable2'].rendered = function () {
  Session.set('ratingPageLimit', initialLimit);
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
    if (scrolltop > 0 && scrolltop < ($("#rating-table").height() - $w.height() )) {
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
};

Template['ratingTable2'].helpers({
  'rows': function () {
    var sort = _Session.get("ratingPageSort");
      if (sort["ratings.rating_cyber"]) {
          sort["metrics.cap.btc"] = sort["ratings.rating_cyber"];
      }
    return CurrentData.find({}, {sort: sort});
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
    return Blaze._globalHelpers._toUnderscores(this.system);
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
    return Counts.get("coinsCounter") > Session.get('ratingPageLimit');
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
  }
});



Template['ratingTable2'].events({
  'click .show-more': function (e, t) {
    var step = CF.Rating.step;
    var limit = Session.get("ratingPageLimit");
    limit += step;
    analytics.track("Viewed Crap",
      {
        counter: (limit - initialLimit) / step
      });
    limit = Math.min(limit, Counts.get("coinsCounter"))
    Session.set("ratingPageLimit", limit);
  },
  'click .no-click a': function () {
    return false;
  }
});
