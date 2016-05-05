function _cap() {
  return Extras.findOne({
    _id: "total_cap"
  })
}

Template['main'].helpers({
  cap: function(){ return _cap()},
  capBtc: function() {
    var cap = _cap();
    return cap ? cap.btc : NaN
  },
  capUsd: function() {
    var cap = _cap();
    return cap ? cap.usd : NaN
  },
  capUsdYesterday: function() {
    var cap = _cap();
    return cap ? cap.usdDayAgo : NaN
  },
  capBtcDailyChange: function () {
    var cap = _cap();
    return cap ? (cap.btc - cap.btcDayAgo)/cap.btc : NaN
  },
  capUsdDailyChange: function () {
    var cap = _cap();
    return cap ? (cap.usd - cap.usdDayAgo)/cap.usd : NaN
  },

})

Template['main'].onCreated(function(){
  i = this;
  i.subscribe('investData');
  i.subscribe('currentDataRP', {selector: {
  }, sort:{'calculatable.RATING.sum': -1}, limit: 5} );

  i.subscribe('crowdsalesAndProjectsList');
});

Template['mainPageSystemsWidget'].helpers({
  systems: function(){
    return CurrentData.find({}, {sort:{'calculatable.RATING.sum': -1}, limit: 5})
  }
});

Template['mainPageCrowdasalesWidget'].helpers({
  activeCrowdsales: function(){
    return CurrentData.find({
      $and: [{crowdsales: {$exists: true}}, {
        'crowdsales.end_date': {
          $gt: new Date()
        }
      }, {
        'crowdsales.start_date': {
          $lt: new Date()
        }
      }]
    }, {sort: {"metrics.currently_raised": -1}}).fetch()
  }
})
