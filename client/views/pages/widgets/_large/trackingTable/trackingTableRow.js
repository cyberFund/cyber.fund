Template['trackingTableRow'].helpers({
  tradeVolumeOk: function(tv) {
    return tv && (tv >= 0.2);
  },
  turnover: function() {
    var metrics = this.metrics;
    if (metrics.cap && metrics.cap.btc) {
      return 100.0 * metrics.turnover;
    }
    return 0;
  },
  firstPrice: function(){
    return this.first_price || {  };
  },
  currentPrice: function() {
    return this.metrics && this.metrics.price && this.metrics.price.usd || 0
  },
})
