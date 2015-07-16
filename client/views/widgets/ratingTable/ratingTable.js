Session.setDefault('curDataSelector', {"ratings.rating": 5});

Deps.autorun(function () {
    Meteor.subscribe("current-data", Session.get('curDataSelector'));
});


Template['ratingTable'].onCreated = function () {

};

Template['ratingTable'].rendered = function () {
    var $thead = $("#fixed-thead");
    var $thead0 = $("#normal-thead");
    function recalcWidths(){
        var widths = [];
        $thead0.find("th").each(function(i, el){
            widths[i] = $(el).innerWidth();
        });
        $thead.find("th").each(function(i, el){
            $(el).css("width", widths[i]+"px");
        });
    }
    var t= _.throttle(function() {
       if ($(window).scrollTop() > 0) {
           if (!$thead.hasClass("show")) {
               //$thead.css("height", $thead0.height()+"px");
               recalcWidths()
               $thead.addClass("show");
           }
       } else {
           $thead.removeClass("show");
           $thead.css("width",'');
           $thead.find("th").each(function(){
               $(this).css("width", '');
           });
       }
    }, 400);

    $(window).scroll(t);
    $(window).resize(recalcWidths);
    $(window).trigger("resize");
};

Session.setDefault("ratingSorter", {
    "ratings.rating": -1,
    "metrics.cap.btc": -1
});

Template['ratingTable'].helpers({
    'rows': function () {
        return CurrentData.find({}, {sort: Session.get("ratingSorter")});
    },
    'img_url': function () {
        return CF.Chaingear.helpers.cgIcon(this);
    },
    // either currency name or name
    displaySystem: function () { //see "ALIASES"
        return this.aliases.CurrencyName || this.nickname;
    },
    symbol: function() {
        if (this.token && this.token.token_symbol) {
            return this.token.token_symbol
        }
        console.log("not found symbol for `" + this.system + '` system');
        return "";
    },
    // underscored currency name
    name_: function () {
        return Blaze._globalHelpers._toU(this.system);
    },
    percentsToText: function (percents) {
        if (percents < 0) {
            return "Deflation " + (-percents).toFixed(2) + "%";
        } else if (percents > 0) {
            return "Inflation " + percents.toFixed(2) + "%";
        } else {
            return "Stable";
        }
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
    percentsToText2: function (percents) {
        if (percents < 0) {
            return "↓ " + (-percents.toFixed(2)) + "%";
        } else if (percents > 0) {
            return "↑ " + percents.toFixed(2) + "%";
        } else {
            return "= 0%";
        }
    },
    percentsToClass: function (percents) {
        return (percents < 0) ? "red-text" : "green-text";
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
        var sel = Session.get("curDataSelector");

        return sel["ratings.rating"] > 1;
    },
    evenMore: function () {
        var sel = Session.get("curDataSelector");
        return (sel["ratings.rating"] < 2) &&
            (!sel.limit ||
            (Session.get('curDataCount') > sel.limit ));
    },
    tradeVolumeOk: function (tv) {
        return tv && (tv >= 0.2);
    },
    turnover: function(){
        var metrics = this.metrics;
        if (metrics.cap && metrics.cap.usd)
        return 100.0* metrics.tradeVolume / metrics.cap.btc;
        return 0;
    },
    dayToDayTradeVolumeChange: function(){
        var metrics = this.metrics;
        if (metrics.tradeVolumePrevious && metrics.tradeVolumePrevious.day)
        return 100.0 * (metrics.tradeVolume - metrics.tradeVolumePrevious.day) / metrics.tradeVolume;
        return 0;
    }
});

Template['ratingTable'].events({
    'click .show-more': function (e, t) {
        var sel = Session.get("curDataSelector");
        var rating = sel["ratings.rating"];
        var tracker;
        switch (rating) {
            case 2:
                sel["ratings.rating"] = 1;
                tracker = '1';
                Session.set('curDataSelector', sel);
                break;
            case 1:
                var count = CurrentData.find().count();
                var newLimit = count + 200;
                sel["ratings.rating"] = 0;
                sel.limit = newLimit;
                Session.set('curDataSelector', sel);
                tracker = '2';
                break;
            case 0:
                sel.limit += 200;
                Session.set('curDataSelector', sel);
                tracker = '3+';
                break;
            default:
                break;
        }
        analytics.track("Viewed Crap",
            {
                counter: tracker
            });
    },
    'click #test': function (e, t) {
        var table = t.$("table#rating-table");
        table.find("thead th").each(function () {
            console.log(t.$(this).width());

        })
    }
});
