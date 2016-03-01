var initialLimit = CF.Rating.limit0;
Meteor.startup(function () {
  _Session.default("coinSorter", {"metrics.cap.btc": -1});
});

Template['trackingWidget'].onCreated(function () {
  var instance = this;
  instance.subscribe("maxLove");
  instance.autorun(function () {
    instance.subscribe("currentDataRP", {
      limit: 150,//Session.get('ratingPageLimit'),
      sort: _Session.get('coinSorter'),
      selector: {'flags.rating_do_not_display': {$ne: true}}
    });
  });

});

Template['trackingWidget'].onRendered ( function () {
  Session.set('ratingPageLimit', 30);
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
    if (scrolltop > 55 && scrolltop < ($("#rating-table").height() - $w.height() )) {
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
  }, 200);

  $(window).scroll(t);
  $(window).resize(recalcWidths);
  $(window).trigger("resize");
});

Template['trackingWidget'].helpers({
  _wl_cs: function(){
    var c = this.metrics && this.metrics.cap && this.metrics.cap.usd || 0;
    var k = 1000, M = 1000000
    if (c < 10*k) return 0;
    if (c < 100*k) return 0.1;
    if (c < 1*M) return 0.2;
    if (c < 10*M) return 0.3;
    if (c < k*M) return 0.4;
    return 0.5;
  },
  _lv: function(){
    if (!this._usersStarred || !this._usersStarred.length) return 0;

    var maxLove = Extras.findOne({_id: 'maxLove'});
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
    return this.calculatable && this.calculatable.firstDatePrice &&
    this.calculatable.firstDatePrice.market && this.calculatable.firstDatePrice.market.price_usd
    || 0
  },
  currentPrice: function() {
    return this.metrics && this.metrics.price && this.metrics.price.usd || 0
  },
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
  symbol: function () {
    if (this.token && this.token.token_symbol) {
      return this.token.token_symbol
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
  },
  hasMore: function () {
    return Counts.get("coinsCounter") > Session.get('ratingPageLimit');
  }
});

Template['trackingWidget'].events({
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
