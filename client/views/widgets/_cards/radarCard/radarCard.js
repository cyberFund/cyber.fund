Template['radarCard'].rendered = function () {

};

Template['radarCard'].helpers({
  name_: function () { //TODO: move to global helpers ?
    return Blaze._globalHelpers._toUnderscores(this._id);
  },
  raised: function() {
    if (this.crowdsales && this.crowdsales.btc_raised) return this.crowdsales.btc_raised;
    if (this.metrics && this.metrics.currently_raised) return this.metrics.currently_raised;
    return 0
  }
});

Template['radarCard'].events({
  'click .bar': function (e, t) {

  }
});
