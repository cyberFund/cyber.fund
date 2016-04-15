Meteor.methods({
  fetchMarketData1: function(systemId){
    return MarketData.find({systemId: systemId}).fetch()
  }
})
