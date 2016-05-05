CF.Chaingear.helpers = {
    /**
     *
     * @param that - CurrentData item
     * @returns {string} url to image
     */
    cgSystemLogoUrl: function () {
        var icon = (this.icon ? this.icon : this._id) || '';
        icon = icon.toString().toLowerCase();
        return "https://static.cyber.fund/logos/" + icon + ".png";
    },
    cgIsActiveCrowdsale: function() {
      return this.crowdsales && this.crowdsales.start_date < new Date() &&
        this.crowdsales.end_date > new Date()
    },
    cgIsUpcomingCrowdsale: function() {
      return this.crowdsales && this.crowdsales.start_date > new Date()
    },
    cgIsPastCrowdsale: function() {
      return this.crowdsales && this.crowdsales.end_date < new Date()
    }
};

_.each(CF.Chaingear.helpers, function (helper, key) {
    UI.registerHelper(key, helper);
});
