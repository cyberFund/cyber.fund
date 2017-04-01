Template['ratingTableRow'].helpers({
  tradeVolumeOk: function (tv) {
    return tv && (tv >= 0.2);
  }
})
