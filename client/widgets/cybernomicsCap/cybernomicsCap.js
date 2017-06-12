import { Extras } from '/imports/api/collections'

Template['cybernomicsCap'].onCreated(() => {
  let instance = this
  //instance.subscribe('')
})

function _cap() {
  return Extras.findOne({
    _id: "total_cap"
  });
}

Template['cybernomicsCap'].helpers({
  cap: function(){ return _cap();},
  capUsd: function() {
    var cap = _cap();
    return cap ? cap.usd : undefined;
  },
  capBtc: function() {
    var cap = _cap();
    return cap ? cap.btc : undefined;
  },

  capUsdYesterday: function() {
    var cap = _cap();
    return cap ? cap.usdDayAgo : undefined;
  },
  capBtcDailyChange: function () {
    var cap = _cap();
    return (cap && cap.btc) ? (cap.btc - cap.btcDayAgo)/cap.btc * 100 : undefined;
  },
  capUsdDailyChange: function () {
    var cap = _cap();
    return (cap && cap.usd) ? (cap.usd - cap.usdDayAgo)/cap.usd * 100 : undefined;
  },
})
