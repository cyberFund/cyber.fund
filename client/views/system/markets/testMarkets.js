const ROWS_SHORT = 20
const markets = require("../../../../imports/vwap/marketsList").xchangeMarkets
const fiats = require("../../../../imports/vwap/marketsList").fiats
const flatten = require("../../../../imports/elastic/traverseAggregations").flatten
const collections = require("../../../../imports/vwap/collections")
const selectors = require("../../../../imports/vwap/selectors")
const feedsCurrent = collections.feedsCurrent
const feedsVwapCurrent = collections.feedsVwapCurrent


CF.test = CF.test || {}
CF.test.printPairs = function(){
  console.log(feedsCurrent.find().fetch())
}
CF.test.printPairsWeighted = function(){
  console.log(feedsVwapCurrent.find().fetch())
}

// get weighted native price, given that there exist both direct and reverted
// market pairs.

function getWeightedPriceNative (base, quote){
  if (base === quote) return 1;
  //1. get both direct and revert price
  // note: for non-weighted pairs - there d be find().fetch(), and also weighting/getting reverse price would involve extra mapreduce step
  const direct = feedsVwapCurrent.findOne(
    selectors.pairsByTwoIdsOrdered(base, quote));
  const reverted = feedsVwapCurrent.findOne(
    selectors.pairsByTwoIdsOrdered(quote, base));

  let revertedPrice, revertedVolume;

  //2. weight them. do not forget volume is given against quote, not base
  if (!direct && !reverted) return undefined;

  // nothing to weight
  if (!reverted) return direct.last.native;

  if (reverted) {
    revertedPrice = 1/reverted.last.native;

    // nothing to weight
    if (!direct) return revertedPrice;

    revertedVolume = reverted.volume.native/reverted.last.native;
    return (direct.last.native*direct.volume.native + revertedPrice*revertedVolume) / (revertedVolume + direct.volume.native)
  }
}

CF.test.gwp = getWeightedPriceNative;
Template["testMarkets"].onCreated(function(){
  const system = Template.currentData().system;

  this.subscribe("pairsToBitcoinWeighted"); // weighted prices to bitcoin

  this.autorun(() => {
    this.subscribe("systemPairs", system);
  })

  this.showAll = new ReactiveVar
  this.showAll.set(false);
});

Template['testMarkets'].helpers({
  rows: function(){
    const system = this.system;
    const selector = selectors.pairsById
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
  pricePairBtc: function() {
    const native = this.last && this.last.native;

    // A/btc = A/B * B/btc
    return native / getWeightedPriceNative(this.base, "Bitcoin")
  },
  pricePairFiat: function(){
    const native = this.last && this.last.native;
    const fiat = CF.Utils._session.get('fiat') //todo => ../imports
    let ret = native / getWeightedPriceNative(this.base, "Bitcoin");
    if (fiat) ret = ret / getWeightedPriceNative("Bitcoin", fiat);
    return ret;
  },
  volumePair: function() {
    return this.volume && this.volume.native
  }
})
