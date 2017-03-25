import chaingear from '/imports/api/server/chaingear'
import {
  CurrentData
} from '/imports/api/collections'
import winston from 'winston'
import {
  HTTP
} from 'meteor/http'

const _source = 'cmc2017'
const sampleData = require('/imports/sampleData/cmc.json')

function fetchLastCmc(callback) {
  HTTP.get('http://api.coinmarketcap.com/v1/ticker', {
    timeout: 10000
  }, function (err, res) {
    if (err) winston.log(`Coukd not fetch ${'http://api.cyber.fund/cg'}`, err, true)
    else {
      if (res.data) {
        return callback(res.data)
      }
    }
    return callback(null)
  });
}

function getLastBtcPrice(){
	let btc = CurrentData.findOne({
		_id: 'Bitcoin'
	}, {
		fields: {
			metrics: 1
		}
	})
	return btc.metrics.price.usd
}

var cmcids = {

}
var flag = false
function init(){
	CurrentData.find().fetch().forEach(function(item){
		if (item.aliases && item.aliases.coinmarketcap) cmcids[item.aliases.coinmarketcap] = item._id;
	})
	cmcids['Bytecoin'] = 'Bytecoin'
	flag = true;
}

var cmc = {
  matchItemToCG: function(item){
		if (!flag) init()
		id = cmcids[item.name]
		if (!id) return null
		let fields = {_id:1, metrics: 1, flags: 1, aliases: 1}
		return CurrentData.findOne({"_id": id}, {fields: fields})
	},
  extractMetrics: function (item, systemId) { // item as in /api.cmc.com/v1/ticker
    let ret = {
      systemId: systemId,
      source: 'cmc2017',
      price: {
        usd: item.price_usd,
        btc: item.price_btc
      },
      supply: {
        total_supply: item.total_supply,
        available_supply: item.available_supply
      },
      trade_volume: {
        volume24_usd: item['24h_volume_usd']
      },
      last_updated: item.last_updated
    }
    return ret
  },
	getMarketDataInserter: function(metrics, system) {
		let lastData = system;
		let supply;
		let price_usd =  +metrics.price.usd
		let price_btc =  +metrics.price.btc
		let btcPrice = price_usd/price_btc
		if (lastData.flags && lastData.flags.supply_from_here) {
      console.log(`system ${metrics.systemId}: flag supply_from_here is set`)
			supply = lastData.metrics && lastData.metrics.supply;
    } else {
      if (metrics.supply.available_supply || metrics.supply.total_supply) {
        supply = metrics.supply.available_supply || metrics.supply.total_supply
      }
    }
		let doc = {
			source: 'cmc2017',
			interval: '5m',
			systemId: metrics.systemId,
			price_btc: price_btc,
			price_usd: price_usd,
			volume24_usd: +metrics.trade_volume.volume24_usd,
			volume24_btc: +metrics.trade_volume.volume24_usd/btcPrice,
			systemId: metrics.systemId,
			cap_usd: supply*price_usd,
			cap_btc: supply*price_btc,
			timestamp: new Date(metrics.last_updated*1000)
		}
		return doc
	},
  getCurrentDataUpdater: function (metrics, system) {
		if (!metrics || !metrics.systemId) return
    let lastData = system
    let $set = {}
    let supply;

    if (lastData.flags && lastData.flags.supply_from_here) {
      console.log(`system ${metrics.systemId}: flag supply_from_here is set`)
			supply = lastData.metrics && lastData.metrics.supply;
    } else {
      if (metrics.supply.available_supply || metrics.supply.total_supply) {
        supply = metrics.supply.available_supply || metrics.supply.total_supply
        $set['metrics.supply'] = supply
      }
    }
		let btcPriceUsd

		if (metrics.price && metrics.price.usd && metrics.price.btc) {
			btcPriceUsd = metrics.price.usd / metrics.price.btc
		} else {
			btcPriceUsd = getLastBtcPrice()
		}

    if (metrics.price && metrics.price.usd) {
      $set["metrics.price.usd"] = metrics.price.usd
      $set["metrics.tradeVolume"] = (metrics.trade_volume.volume24_usd || 0) / btcPriceUsd
      $set['metrics.cap.usd'] = metrics.price.usd * supply
    }

    if (metrics.price && metrics.price.btc) {
      $set["metrics.price.btc"] = metrics.price.btc
      $set['metrics.cap.btc'] = metrics.price.btc * supply
    }
    try {
      let ts = parseInt(metrics.last_updated) * 1000
      $set['metrics.updatedAt'] = new Date(ts)
    } catch (e) {

    }
    $set['metrics.updateSource'] = 'cmc2017'
    //todo: use chaingear, not CurrentData everywhere
    return $set
  },
  fetch: fetchLastCmc
}

module.exports = cmc
