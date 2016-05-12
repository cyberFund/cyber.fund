Meteor.methods({
  fetchMarketData1: function(systemId){
    return MarketData.find({
      systemId: systemId,
      interval: Meteor.settings.public.manyData ? {$in: ['daily', 'hourly']}
      : "daily" }).fetch()
  },
  fetchMarketData2: function(systemId, from, to){
    return MarketData.find({
      systemId: systemId,
      interval: {$in: ['daily', 'hourly']},
      timestamp: {$gte: from, $lte: to}
    }).fetch()
  },
})
