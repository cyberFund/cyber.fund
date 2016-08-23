Template["radarCard"].rendered = function () {
  // meteor._session.set("somekey", null)
  // TODO: already wasfactored out somehow.
  // TODO: !!!!!!!!!!!!!!11
};

Template["radarCard"].helpers({

  name_: function () { //TODO: move to global helpers ?
    return Blaze._globalHelpers._toUnderscores(this._id);
  },
  raised: function() {
    // if crowdsale is raising money through non mainstream way,
    // return -1 to display "non compliant message"
    if (!this.crowdsales.genesis_address) return -1

    if (this.metrics && this.metrics.currently_raised) return this.metrics.currently_raised;
    if (this.crowdsales && this.crowdsales.btc_raised) return this.crowdsales.btc_raised;
    return 0;
  },
  active: function (){
    return  false;// return meteor._session.get("somekey")
  }
});

Template["radarCard"].events({
  "click .bar": function (e, t) {

  }
});
