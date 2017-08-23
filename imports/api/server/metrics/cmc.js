import chaingear from '/imports/api/server/chaingear'
import { CurrentData } from '/imports/api/collections'
import winston from 'winston'
import { HTTP } from 'meteor/http'
import { getLatestBeforeDate } from '/imports/api/MarketData'
import { lastBtcPrice } from '/imports/api/prices'

const _source = 'cmc2017'
//const sampleData = require('/imports/sampleData/cmc.json')
const DAY = 24*3600*1000

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

function isNil(it){
  return (it == undefined || it == null)
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
      source: _source,
      price: {
        usd: item.price_usd,
        btc: item.price_btc
      },
      supply: {
        total_supply: item.total_supply,
        available_supply: item.available_supply
      },
      trade_volume: {
        volume24_usd: item['24h_volume_usd'],
      },
      last_updated: item.last_updated
    }
    if (item.price_btc) ret.trade_volume.volume24_btc = item['24h_volume_usd']/+item.price_btc
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
			source: _source,
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
    function getSupplyFromDataPoint(point){
      return point.supply ? point.supply : (point.price_btc ? point.cap_btc/point.price_btc : undefined)
    }
    function getChange(now, before){
      if (isNil(now) || isNil(before)) return undefined
      return now - before
    }
    function getChangePercents(now, before) {
      if (isNil(now) || isNil(before)) return undefined
      return (now > 0) ? (100.0 * (now - before) / now) : (0)
    }

		if (!metrics || !metrics.systemId) return "...if (!metrics || !metrics.systemId) return '...'"
    let lastData = system
    let sel = {systemId: metrics.systemId, source: _source}
    let dayAgoMetrics = getLatestBeforeDate(sel, new Date(metrics.last_updated * 1000 - DAY))
    let weekAgoMetrics = getLatestBeforeDate(sel, new Date(metrics.last_updated * 1000 - 7 * DAY))
    let monthAgoMetrics = getLatestBeforeDate(sel, new Date(metrics.last_updated * 1000 - 30 * DAY))
    let dayAgoSupply = dayAgoMetrics && getSupplyFromDataPoint(dayAgoMetrics)
    let weekAgoSupply = weekAgoMetrics && getSupplyFromDataPoint(weekAgoMetrics)
    let monthAgoSupply = monthAgoMetrics && getSupplyFromDataPoint(monthAgoMetrics)

    let set = {}
    let supply;

    // cmc gives that Iota price per milion tokens. supply is given however in tokens.
    if (system._id == 'Iota') {
      if (metrics.price) {
        metrics.price.btc = metrics.price.btc/1000000
        metrics.price.usd = metrics.price.usd/1000000
      }
    }

    let condition = {
      supplyFromDb: lastData.flags && lastData.flags.supply_from_here,
      btcPrice: metrics.price && +metrics.price.btc,
      usdPrice: metrics.price && +metrics.price.usd,
      usdBtcPrice: metrics.price && metrics.price.usd && metrics.price.btc,
    }
    if (condition.supplyFromDb) {
			supply = lastData.metrics && lastData.metrics.supply;
    } else {
      if (metrics.supply.available_supply || metrics.supply.total_supply) {
        supply = metrics.supply.available_supply || metrics.supply.total_supply
        set['metrics.supply'] = supply
      }
    }
		let btcPriceUsd

		if (condition.usdBtcPrice) {
			btcPriceUsd = +metrics.price.usd / metrics.price.btc
		} else {
			btcPriceUsd = lastBtcPrice()
		}

    if (condition.usdPrice) {
      set["metrics.price.usd"] = +metrics.price.usd
      set["metrics.tradeVolume"] = (metrics.trade_volume.volume24_usd || 0) / btcPriceUsd
      set['metrics.cap.usd'] = +metrics.price.usd * supply
    }

    if (condition.btcPrice) {
      set["metrics.price.btc"] = +metrics.price.btc
      set['metrics.cap.btc'] = metrics.price.btc * supply
    }
    try {
      let ts = +metrics.last_updated * 1000
      set['metrics.updatedAt'] = new Date(ts)
    } catch (e) {}
    set['metrics.updateSource'] = 'cmc2017'

    if (dayAgoMetrics) {
      set["metrics.priceChange.day.usd"] = getChange( +set["metrics.price.usd"], +dayAgoMetrics.price_usd);
      set["metrics.priceChangePercents.day.usd"] = getChangePercents( +set["metrics.price.usd"], +dayAgoMetrics.price_usd)

      set["metrics.priceChange.day.btc"] = getChange( +set["metrics.price.btc"], +dayAgoMetrics.price_btc);
      set["metrics.priceChangePercents.day.btc"] = getChangePercents( +set["metrics.price.btc"], +dayAgoMetrics.price_btc)

      set["metrics.capChangePercents.day.btc"] = getChangePercents( +set['metrics.cap.btc'], +dayAgoMetrics.cap_btc)
      set["metrics.capChange.day.btc"] = getChange( +set["metrics.cap.btc"], +dayAgoMetrics.cap_btc);

      set["metrics.capChangePercents.day.usd"] = getChangePercents( +set['metrics.cap.usd'], +dayAgoMetrics.cap_usd)
      set["metrics.capChange.day.usd"] = getChange( +set["metrics.cap.usd"], +dayAgoMetrics.cap_usd);

      if (condition.supplyFromDb) {
        set["metrics.supplyChange.day"] = 0
        set["metrics.supplyChangePercents.day"] = 0
      } else {
        set["metrics.supplyChangePercents.day"] = getChangePercents(supply, dayAgoSupply);
        set["metrics.supplyChange.day"] = getChange(supply, dayAgoSupply);
      }
      set["metrics.tradeVolumePrevious.day"] = dayAgoMetrics.volume24_btc
    }

    if (weekAgoMetrics) {
      set["metrics.priceChange.week.usd"] = getChange( set["metrics.price.usd"], weekAgoMetrics.price_usd);
      set["metrics.priceChangePercents.week.usd"] = getChangePercents( set["metrics.price.usd"], weekAgoMetrics.price_usd)

      set["metrics.priceChange.week.btc"] = getChange( set["metrics.price.btc"], weekAgoMetrics.price_btc);
      set["metrics.priceChangePercents.week.btc"] = getChangePercents( set["metrics.price.btc"], weekAgoMetrics.price_btc)

      set["metrics.capChangePercents.week.btc"] = getChangePercents( set['metrics.cap.btc'], weekAgoMetrics.cap_btc)
      set["metrics.capChange.week.btc"] = getChange( set["metrics.cap.btc"], weekAgoMetrics.cap_btc);

      set["metrics.capChangePercents.week.usd"] = getChangePercents( set['metrics.cap.usd'], weekAgoMetrics.cap_usd)
      set["metrics.capChange.week.usd"] = getChange( set["metrics.cap.usd"], weekAgoMetrics.cap_usd);

      if (condition.supplyFromDb) {
        set["metrics.supplyChange.week"] = 0
        set["metrics.supplyChangePercents.week"] = 0
      } else {
        set["metrics.supplyChangePercents.week"] = getChangePercents(supply, weekAgoSupply);
        set["metrics.supplyChange.week"] = getChange(supply, weekAgoSupply);
      }
      set["metrics.tradeVolumePrevious.week"] = weekAgoMetrics.volume24_btc
    }

    if (monthAgoMetrics) {
      set["metrics.priceChange.month.usd"] = getChange( set["metrics.price.usd"], monthAgoMetrics.price_usd);
      set["metrics.priceChangePercents.month.usd"] = getChangePercents( set["metrics.price.usd"], monthAgoMetrics.price_usd)

      set["metrics.priceChange.month.btc"] = getChange( set["metrics.price.btc"], monthAgoMetrics.price_btc);
      set["metrics.priceChangePercents.month.btc"] = getChangePercents( set["metrics.price.btc"], monthAgoMetrics.price_btc)

      set["metrics.capChangePercents.month.btc"] = getChangePercents( set['metrics.cap.btc'], monthAgoMetrics.cap_btc)
      set["metrics.capChange.month.btc"] = getChange( set["metrics.cap.btc"], monthAgoMetrics.cap_btc);

      set["metrics.capChangePercents.month.usd"] = getChangePercents( set['metrics.cap.usd'], monthAgoMetrics.cap_usd)
      set["metrics.capChange.month.usd"] = getChange( set["metrics.cap.usd"], monthAgoMetrics.cap_usd);

      if (condition.supplyFromDb) {
        set["metrics.supplyChange.month"] = 0
        set["metrics.supplyChangePercents.month"] = 0
      } else {
        set["metrics.supplyChangePercents.month"] = getChangePercents(supply, monthAgoSupply);
        set["metrics.supplyChange.month"] = getChange(supply, monthAgoSupply);
      }
      set["metrics.tradeVolumePrevious.month"] = monthAgoMetrics.volume24_btc
    }
    //todo: use chaingear, not CurrentData everywhere
    return set
  },
  fetch: fetchLastCmc
}

module.exports = cmc
