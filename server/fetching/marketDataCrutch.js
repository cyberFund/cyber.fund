import printError from '/imports/api/server/printError'
import winston from 'winston'
import {feedsCurrent as FeedsCurrent} from '/imports/vwap/collections'
import FastData from '/imports/api/server/fastData'
import {handleArrayWithInterval} from '/imports/api/handleArray'

const config = {
  xcm: {
    url: "http://api.cyber.fund/xcm"
  },
  cmc: {
    url: "https://api.coinmarketcap.com/v1/ticker/"
  }
}

SyncedCron.add({
  name: "cmc fetches 1",
  schedule: function (parser) {
    // parser is a later.parse object
    return parser.cron("0/5 * * * *", false);
  },
  job: function () {
    var result = HTTP.get(onfig.cmc.url);
    console.log(result.data);
  }
});

function cmc_async_callback(error, response){
  winston.info("cmc_response", response)
}

SyncedCron.add({
  name: "xcm fetches 2",
  schedule: function (parser) {
    // parser is a later.parse object
    return parser.cron("0/1 * * * *", false);
  },
  job: function () {
    var result = HTTP.get(config.xcm.url);
    console.log("---")
    handleArrayWithInterval(result.data, 20, function(item){
      const existing = FeedsCurrent.findOne({
        source: 'xcm',
        type: 'bq',
        timestamp: item.timestamp,
        base: item.base,
        quote: item.quote
      })
      if (existing) return;

  //    { timestamp: 1463155317000,
//     market: 'http://www.gatecoin.com',
//    base: 'Euro',
//     quote: 'Ethereum',
//    last: { native: 9.13000001 },
//     volume: { native: 10718.37899525 } } ]
    })
    console.log(result.data)

  }
})
