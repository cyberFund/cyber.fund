Template["cgLinkToSystemCardCrowdsale"].helpers({
  raised: function() {
    // if crowdsale is raising money through non mainstream way,
    // return -1 to display "non compliant message"
    if (!this.crowdsales.genesis_address) return -1

    if (this.metrics && this.metrics.currently_raised) return this.metrics.currently_raised;
    if (this.crowdsales && this.crowdsales.btc_raised) return this.crowdsales.btc_raised;
    return 0;
  }
})
