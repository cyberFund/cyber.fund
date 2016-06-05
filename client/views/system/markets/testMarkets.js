const ROWS_SHORT = 20
const markets = require("../../../../imports/vwap/marketsList").xchangeMarkets
const fiats = require("../../../../imports/vwap/marketsList").fiats
const flatten = require("../../../../imports/elastic/traverseAggregations").flatten
const feedsCurrent = require("../../../../imports/vwap/collections").feedsCurrent

CF.test = CF.test || {}
CF.test.printPairs = function(){
  console.log(feedsCurrent.find().fetch())
}

Template["testMarkets"].onCreated(function(){
  const system = Template.currentData().system;
  console.log(system);
  this.autorun(() => {
    this.subscribe("systemPairs", system);
  })
  this.showAll = new ReactiveVar
  this.showAll.set(false);
});


Template['testMarkets'].helpers({
  rows: function(){
    const system = this.system;
    const selector = require("../../../../imports/vwap/selectors").pairsById
    const count = feedsCurrent.find(selector).count();
    return feedsCurrent.find(selector, {
      sort: {volume: -1},
      limit: (count <= ROWS_SHORT || Template.instance().showAll.get()) ? 1000 : ROWS_SHORT})
  },
  marketUrlByApiUrl: (apiUrl) => {
    const market = markets[apiUrl];
    return market && market.url || ''
  },
  marketNameByApiUrl: (apiUrl) => {
    const market = markets[apiUrl];
    return market && market.name || apiUrl
  },
  tokenById: function(_id) {
    const sys = CurrentData.findOne({_id: _id}, {fields: {token: 1}});
    return sys && sys.token && sys.token.symbol || _id
  },
  pricePair: function() {
    return this.last && this.last.native
  },
  volumePair: function() {
    return this.volume && this.volume.native
  }
})
