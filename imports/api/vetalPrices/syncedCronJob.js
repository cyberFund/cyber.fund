import prices from './collection'
function pushPrices(){
  CurrentData.find({"metrics.price":{$exists:true}}, {fields:{ "metrics.price": 1}}).forEach(item => {
     let timestamp = moment().startOf('hour')._d
     prices.insert({
       systemId: item._id,
       priceUsd: item.metrics.price.usd,
       priceBtc: item.metrics.price.btc,
       timestamp: timestamp
     })
  })
}

exports.test = pushPrices

export default function(){
  SyncedCron.add ({
    name: "daily prices for Lvov",
    schedule: function (parser) {
      // parser is a later.parse object
      return parser.cron("1 12 * * *", false);
    },
    job: function () {
      pushPrices();
    }
  })
}
