import printError from '/imports/api/server/printError'
import winston from 'winston'

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
    console.log(result.data)
    console.log(`result.data length ${result.data.length}`)
    console.log("...")
    console.log()
  }
})
