Meteor.methods({
  fetchMarketData1: function(systemId){
    return MarketData.find({
      systemId: systemId,
      interval: Meteor.settings.public.manyData ? {$in: ['daily', 'hourly']}  
      : "daily" }).fetch()
  }
})
