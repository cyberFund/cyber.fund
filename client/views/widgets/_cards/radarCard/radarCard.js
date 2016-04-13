Template['radarCard'].rendered = function () {

};

Template['radarCard'].helpers({
  name_: function () { //TODO: move to global helpers ?
    return Blaze._globalHelpers._toUnderscores(this.system);
  },
  isActiveCrowdsale: function(){
    return this.crowdsales && this.crowdsales.start_date < new Date() &&
      this.crowdsales.end_date > new Date()
  },
  isUpcomingCrowdsale: function(){
    return this.crowdsales && this.crowdsales.start_date > new Date()
  },
  isPastCrowdsale: function(){
    return this.crowdsales && this.crowdsales.end_date < new Date()
  }
});

Template['radarCard'].events({
  'click .bar': function (e, t) {

  }
});
