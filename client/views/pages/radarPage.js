
Template['radarPage'].helpers({
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

Template['radarPage'].events({
});