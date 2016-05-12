var day = 1000 * 60 * 60 * 24;
Meteor.methods({
  fetchMarketData1: function(systemId){
    return MarketData.find({
      systemId: systemId,
      interval: Meteor.settings.public.manyData ? {$in: ['daily', 'hourly']}
      : "daily" }).fetch()
  },
  fetchMarketData2: function(systemId, from, to){
    var ret = MarketData.find({
      systemId: systemId,
      interval: {$in: ['daily', 'hourly']},
      timestamp: {$gte: from, $lte: to}
    }).fetch();

    if ((to.valueOf() - from.valueOf())/day < 4) {
      ret = ret.concat(FastData.find({
        systemId: systemId,
        interval: {$in: ['daily', 'hourly']},
        timestamp: {$gte: from, $lte: to}
      })).fetch();
    }
    return ret;
  }
})
