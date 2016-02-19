Template['ratingTableRow'].helpers({
  tradeVolumeOk: function (tv) {
    return tv && (tv >= 0.2);
  },
  _ready: function(){
    return CF.CurrentData._sub_.ready();
  },
  
})
