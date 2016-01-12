Template['ratingTableRow'].helpers({
  tradeVolumeOk: function (tv) {
    return tv && (tv >= 0.2);
  },
  turnover: function () {
    var metrics = this.metrics;
      if (metrics.cap && metrics.cap.btc) {
          return 100.0 * metrics.turnover;
      }
    return 0;
  }
})
