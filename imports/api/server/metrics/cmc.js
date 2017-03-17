import chaingear from '/imports/api/server/chaingear'
import {CurrentData} from '/imports/api/collections'
import winston from 'winston'
import { HTTP } from 'meteor/http'
const _source = 'cmc2017'
const sampleData =require('/imports/sampleData/cmc.json')

function fetch(callback) {
  HTTP.get('http://api.coinmarketcap.com/v1/ticker', {
    timeout: 10000
  }, function(err, res) {
    if (err) winston.log(`Coukd not fetch ${'http://api.cyber.fund/cg'}`, err, true)
    else {
      if (res.data) {
        return callback(res.data)
      }
    }
    return callback(null)
  });
}

function matchItemToCG(item) {
  /*if (!cmcids) {
    console.log(`matchItemToCG: /imports/api/server/metrics/cmc was not initialized properly. use reinit method`)
    return;
  }*/
  return _.find(chaingear.data(), function(cg_item) {
    if ((!cg_item.aliases) ||
     (!cg_item.token) ||
     (!cg_item.aliases.coinmarketcap)) return false;
    if (cg_item.aliases.coinmarketcap.indexOf("+") == -1)
      return (cg_item.aliases.coinmarketcap == item.name) //&& (item.symbol == cg_item.token.symbol)
    else {
      var _split = cg_item.aliases.coinmarketcap.trim().split("+");
      return (_split[0] == item.name) && (_split[1] == item.symbol)
    }
  });
}

var cmc = {
  data: {
    cmcids: {}
  },
  reinit: function(){
    let store = {}
    sampleData.forEach(function(data){
      let match = matchItemToCG(data)
      if (match && match.system) {
        store[data.id] = match.system
      }
    })
	store['melon'] = 'Melonport'
    this.data.cmcids = store;
  },
  systemIdFromCmcId: function(cmcid){
    if (!this.data.cmcids) return null
    return this.data.cmcids[cmcid]
  },
  extractMetrics: function(item){ // item as in /api.cmc.com/v1/ticker
    let systemId = this.systemIdFromCmcId(item.id)
    if (!systemId) {
      return null;
    }
    let ret = {
      systemId: systemId,
      source: 'cmc2017',
      timeline: 'latest',
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
  applyMetrics: function(metrics){

    let currentData = CurrentData.findOne({_id: metrics.systemId}, {
      fields: {flags: 1, metrics: 1}
    })

    let btc = CurrentData.findOne({_id: 'Bitcoin'}, {
      fields: {metrics: 1}
    })
    //  ==
    let $set = {
    }

    let supply = currentData.metrics && currentData.metrics.supply;

    if (currentData.flags && currentData.flags.supply_from_here){
      console.log(`system ${metrics.systemId}: flag supply_from_here is set`)
    } else {
      if (metrics.supply.available_supply || metrics.supply.total_supply) {
        supply = metrics.supply.available_supply || metrics.supply.total_supply
        $set['metrics.supply'] = supply
      }
    }


    if (metrics.price && metrics.price.usd) {
      $set["metrics.price.usd"] = metrics.price.usd
      $set["metrics.tradeVolume"] = (metrics.trade_volume.volume24_usd || 0)/btc.metrics.price.usd
      $set['metrics.cap.usd'] = metrics.price.usd* supply
    }

    if (metrics.price && metrics.price.btc) {
      $set["metrics.price.btc"] = metrics.price.btc
      $set['metrics.cap.btc'] = metrics.price.btc* supply
    }
    try {
      let ts = parseInt(metrics.last_updated)  *1000
      $set['metrics.updatedAt'] = new Date(ts)
    } catch(e) {

    }
    $set['metrics.updateSource'] = 'cmc2017'
    //todo: use chaingear, not CurrentData everywhere
    return $set
  },
  fetch: fetch
}

module.exports = cmc
