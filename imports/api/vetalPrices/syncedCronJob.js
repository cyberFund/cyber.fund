import {CurrentData} from '/imports/api/collections'
import prices from './collection'

function pushPrices() {
    CurrentData.find({
        "metrics.price": {
            $exists: true
        }
    }, {
        fields: {
            "metrics.price": 1,
            "metrics.cap": 1,
            "metrics.tradeVolume": 1,
            "metrics.turnover": 1,
            "metrics.supply": 1,
            "token.symbol": 1
        }
    }).forEach(item => {
        let timestamp = moment().startOf('hour')._d
        let m = item.metrics;
        prices.insert({
            systemId: item._id,
            ticker: item.token && item.token.symbol,
            priceBtc: m.price.btc,
            priceUsd: m.price.usd,
            capBtc: m.cap && m.cap.btc,
            capUsd: m.cap && m.cap.usd,
            supply: m.supply,
            tradeVolume: m.tradeVolume,
            turnover: m.turnover,
            timestamp: timestamp
        })
    })
}

exports.test = pushPrices

export default function() {
    SyncedCron.add({
        name: "daily prices for Lvov",
        schedule: function(parser) {
            // parser is a later.parse object
            return parser.cron("1 0/12 * * *", false);
        },
        job: function() {
            pushPrices();
        }
    })
}
