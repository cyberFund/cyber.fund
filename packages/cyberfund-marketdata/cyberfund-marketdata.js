// Write your package code here!
CF.MarketData = {};
CF.MarketData.collection = new Meteor.Collection("MarketData");

CF.MarketData.btcPriceaLatestDoc = function () {
  return MarketData.findOne({
    "token.token_symbol": 'BTC',
    'metrics.price': {$exists: true}
  }, {sort: {timestamp: -1}, limit: 1});
};
