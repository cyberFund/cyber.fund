Session.setDefault('curDataSelector', {rating: 5});

Deps.autorun(function () {
  Meteor.subscribe("current-data", Session.get('curDataSelector'));
});


Template['ratingTable'].onCreated = function () {

};

Template['ratingTable'].rendered = function () {

};

Session.setDefault("ratingSorter", {
  rating: -1,
  "cap.btc": -1
});

Template['ratingTable'].helpers({
  'rows': function () {
    return CurrentData.find({"cap.btc": {$gt: 0}}, {sort: Session.get("ratingSorter")});
  },
  'img_name': function () {
    var ret = (this.icon ? this.icon : this.name) || '';
    return ret.toString().toLowerCase();
  },
  _name: function () { //see "ALIASES"
    return this.cyberName || this.name;
  },
  name_: function(){
    return Blaze._globalHelpers._toU(this.name);
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
  deviationToText: function (deviation, absolute) {
    if (!absolute) {
      return "Normal";
    }
    if (Math.abs(deviation / absolute) < 0.05) {
      return "Normal";
    }
    if (deviation > 0) {
      return "High";
    }
    return "Low";
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
    var sel = Session.get("curDataSelector")

    return sel.rating > 1;
  },
  evenMore: function () {
    var sel = Session.get("curDataSelector")
    return (sel.rating < 2) &&
      (!sel.limit ||
      (Session.get('curDataCount') > sel.limit ));
  },
  tradeVolumeOk: function (tv) {
    return tv && (tv >= 1.0);
  }
});

Template['ratingTable'].events({
  'click .show-more': function (e, t) {
    var sel = Session.get("curDataSelector");
    var rating = sel.rating;
    var tracker;
    switch (rating) {
      case 2:
        sel.rating = 1;
        tracker = '1';
        Session.set('curDataSelector', sel);
        break;
      case 1:
        var count = CurrentData.find().count();
        var newLimit = count + 200;
        sel.rating = 0;
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
  }
});
