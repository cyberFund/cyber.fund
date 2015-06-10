Meteor.autorun(function () {
  Meteor.subscribe("current-data", Session.get("curDataLimit"));
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
    return (this.name ? this.name : '').toString().toLowerCase();
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
    return Session.get('curDataLimit') < Session.get("curDataCount");
  }
});

Template['ratingTable'].events({
  'click .show-more': function (e, t) {
    if (Session.get('curDataLimit') < Session.get("curDataCount")) {
      Session.set('curDataLimit', Session.get('curDataLimit') + 100)
    }
  }
});


Template['hitryImage'].rendered = function () {
  var $image = this.$('img');

  $image.on('load', function () {
    $image.removeClass('hidden');
  });

  if ($image[0].complete) {
    $image.load();
  }
}
