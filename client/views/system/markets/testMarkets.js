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


// get weighted native price, given that there can exist both direct and
// reverted market pairs.
function weightedPriceNative (base, quote){
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


// return name of currently picked fiat. as it s given by xchange
// todo: move to imports
function _fiat(){
  const fiat = CF.Utils._session.get('fiat');
  if (fiat==='') return 'Bitcoin';
  return fiat;
}

// return token of currently picked fiat. see `fiatSelector` template
// todo: move to imports
function _fiatToken(){
  const fiat = CF.Utils._session.get('fiat');
  if (fiat==="") return `BTC`;
  //todo exploit chg
  if (fiat==="Euro") return 'EUR';
  if (fiat==="US Dollar") return 'USD';
}


CF.test.gwp = weightedPriceNative;
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
    function sortVolumeBtc(x, y){
      function volumeBtc(point){
        return point.volume.native/weightedPriceNative(point.quote, "Bitcoin");
      }
      return Math.sign(volumeBtc(y) - volumeBtc(x))
    }
    let ret = feedsCurrent.find(selector).fetch().sort(sortVolumeBtc);
    console.log(ret);
    if (!Template.instance().showAll.get()) ret = ret.slice(0, ROWS_SHORT);
    return ret;
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
  // not used
  pricePair: function() {
    return this.last && this.last.native
  },
  // not used
  pricePairBtc: function() {
    const native = this.last && this.last.native;

    // A/btc = A/B * B/btc
    return native / weightedPriceNative(this.base, "Bitcoin")
  },
  fiatToken: _fiatToken,
  pricePairFiat: function(){
    const native = this.last && this.last.native;
    const ret = native / weightedPriceNative(this.base, "Bitcoin");
    return ret / weightedPriceNative("Bitcoin", _fiat());
  },
  volumePairFiat: function() {
    const native = this.volume && this.volume.native;
    return this.volume.native/weightedPriceNative(this.quote, "Bitcoin")/
    weightedPriceNative("Bitcoin", _fiat());
  }
})
