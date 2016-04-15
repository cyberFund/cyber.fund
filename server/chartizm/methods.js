Meteor.methods({
  fetchMarketData1: function(systemId){
    return MarketData.find({systemId: systemId}, {fields: {
      _id: 0, cap_usd: 0, cap_btc: 0, source: 0, volume24_usd: 0    }}).fetch()
  }
})
