import winston from 'winston'
import extractFromPromise from '/imports/api/server/extractFromPromise'
import cfEs from '/imports/api/cfEs/server/cyberfund-es'
import {feedsCurrent, feedsVwapCurrent} from './collections'
import FastData from '/imports/api/server/fastData'
import {CurrentData} from '/imports/api/collections'

const feedUrlXcm = 'http://api.cyber.fund/xcm'
const feedUrlCmc = 'https://api.coinmarketcap.com/v1/ticker'

import {default as weightedPriceNative} from './weightedPriceNative'

feedsCurrent._ensureIndex({
  source: 1, market: 1, base: 1, quote: 1
}, {unique: true, dropDups: true});

feedsCurrent._ensureIndex({
  source: 1, market: 1, base: 1, quote: 1
})

feedsVwapCurrent._ensureIndex({
  source: 1, base: 1, quote: 1
}, {unique: true, dropDups: true});


function fetchDirect() {
  var res = HTTP.get(feedUrlXcm, {
    timeout: 10000
  }, function(err, res) {
    if (err) winston.log('error', "Coukd not fetch", err)
    else {
      const source = 'xcm'
      if (res.data && Array.isArray(res.data)) {
        res.data.forEach(function(it) {
          it.source = source
          const _id = [source, it.quote, it.base, it.market].join('_')
          feedsCurrent.upsert({
            _id: _id, source: it.source, market: it.market, quote: it.quote, base: it.base
          }, {$set: it})
          let checkExists = FastData.findOne({
            source: source, market: it.market, quote: it.quote, base: it.base,
            timestamp: it.timestamp
          })
          if (!checkExists) {
            FastData.insert(it)
          }
        })
      }
    }
  });
}

var systems = CurrentData.find({}, {fields: {
  token: 1, aliases: 1, system: 1
}})
console.log(systems)

function fetchDirectCmc() {

  var res = HTTP.get(feedUrlCmc, {
    timeout: 10000
  }, function(err, res) {
    if (err) winston.log('error', "Coukd not fetch", err)
    else {
      const source = 'cmc'
      if (res.data && Array.isArray(res.data)) {
        res.data.forEach(function(it) {
          it.source = source
          const _id = [source, it.quote, it.base, it.market].join('_')
          feedsCurrent.upsert({
            _id: _id, source: it.source, market: it.market, quote: it.quote, base: it.base
          }, {$set: it})
          let checkExists = FastData.findOne({
            source: source, market: it.market, quote: it.quote, base: it.base,
            timestamp: it.timestamp
          })
          if (!checkExists) {
            FastData.insert(it)
          }
        })
      }
    }
  });
}


const flatten = require("../elastic/traverseAggregations").flatten

const _fetchXchangeData = () => {
  const data = extractFromPromise(cfEs.sendQuery ("xchangeData"));
  if (data && data.aggregations)
    return flatten(data, ['by_quote', 'by_base', 'by_market', 'latest']);
  else
    return []
}

const _fetchXchangeVwapData = () => {
  const data = extractFromPromise(cfEs.sendQuery ("xchangeVwapData"));
  if (data && data.aggregations)
    return flatten(data, ['by_quote', 'by_base', 'latest']);
  else
    return []
}

function volumeBtc(point){
  return point.volume.native/weightedPriceNative(point.quote, "Bitcoin");
}

function priceBtc(point){
  return point.last.native / weightedPriceNative(point.base, "Bitcoin")
}

exports.fetchDirect = fetchDirect
exports.fetchDirectCmc = fetchDirectCmc
exports.fetchXchangeData = () => {
  const ret = _fetchXchangeData();
  _.each(ret, function(item) {
    const it = _.omit(item._source, ['price', 'volume']);
    const _id = [it.quote, it.base, it.market].join('_')
    //TODO: handling depending on index version.
    // (can get version from form item._index,  )
    it.last = {native: item._source.price}
    it.volume = {native: item._source.volume}
    it.volume.btc = volumeBtc(it)
    it.last.btc = priceBtc(it);

    xchangeCurrent.upsert({
      _id: _id, source: null, market: it.market, quote: it.quote, base: it.base
    }, {$set: it})
  });
}

exports.fetchXchangeVwapData = () => {
  const ret = _fetchXchangeVwapData();
  _.each(ret, function(item) {
    const it = _.omit(item._source, ['price', 'volume_daily']);
    const _id = [it.quote, it.base].join('_')
    //TODO: handling depending on index version.
    it.last = {native: item._source.price}
    it.volume = {native: item._source.volume_daily}
    it.volume.btc = volumeBtc(it)
    it.last.btc = priceBtc(it);

    xchangeVwap.upsert({
      _id: _id, quote: it.quote, base: it.base
    }, {$set: it})
  });
}
