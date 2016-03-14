Meteor.startup(function () {
  _Session.default("coinSorter", {"metrics.cap.btc": -1});
});


var initialLimit = CF.Rating.limit0;

Template['ratingTable'].onCreated(function () {
  Session.set('ratingPageLimit', initialLimit);
  var instance = this;
  instance.autorun(function () {
    CF.CurrentData._sub_ = instance.subscribe("currentDataRP", {
      limit: Session.get('ratingPageLimit'),
      sort: _Session.get('coinSorter'),
      selector: {'flags.rating_do_not_display': {$ne: true}, "calculatable.RATING.sum": {$gte: 1}}
    });
  });

});

Template['ratingTable'].rendered = function () {
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

Template['ratingTable'].helpers({
  'rows': function () {
    var sort = _Session.get("coinSorter");
      if (sort["ratings.rating_cyber"]) {
          sort["metrics.cap.btc"] = sort["ratings.rating_cyber"];
      }
    return CurrentData.find({}, {sort: sort});
  },
  'img_url': function () {
    return CF.Chaingear.helpers.cgSystemLogo(this);
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
  }
});



Template['ratingTable'].events({
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
