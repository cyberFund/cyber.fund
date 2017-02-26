export default {
    cgSystemLogoUrl: function (that) {
      var icon = (that.icon ? that.icon : that._id) || '';
      icon = icon.toString().toLowerCase();
      return "https://static.cyber.fund/logos/" + icon + ".png";
    },
    cgIsActiveCrowdsale: function(that) {
      return that.crowdsales && that.crowdsales.start_date < new Date() &&
        that.crowdsales.end_date > new Date()
    },
    cgIsUpcomingCrowdsale: function(that) {
      return that.crowdsales && that.crowdsales.start_date > new Date()
    },
    cgIsPastCrowdsale: function(that) {
      return that.crowdsales && that.crowdsales.end_date < new Date()
    }
}
