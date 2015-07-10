var currentData = {meta: {}};
var logger = log4js.getLogger("meteor-fetching-es");

var latestDep = new Tracker.Dependency;
function _normKey(str) { //thing is, elasticsearch by default returns long string as (first 15 symbols + '...')
    // not sure yet how to force it returning full key, so for now just cutting result + searching by "starts_with"
    return str.slice(0, 15);
}

var esParsers = {
        errorLogger: function esErrorHandler(rejection) {
            logger.error(rejection);
        },
        latest_values: function parseLatestValues(result) {
            if (!result || !result.aggregations || !result.aggregations.by_system
                || !result.aggregations.by_system.buckets) {
                this.errorLogger(result);
                return;
            }
            var buckets = result.aggregations.by_system.buckets; //todo: resolve this crap using smth built into queries.

            _.each(buckets, function (bucket) {
                bucket.key = _normKey(bucket.key);
                if (!currentData[bucket.key]) currentData[bucket.key] = {};
                var it = currentData[bucket.key];
                it.latest_supply = bucket.latest_supply.hits.hits[0]._source.supply_current;

                var reg = new RegExp('^' + CF.Utils.escapeRegExp(bucket.key));
                CurrentData.update({
                        $or: [
                            {"aliases.CoinMarketCap": {$regex: reg, $options: 'i'}},
                            {"name": {$regex: reg, $options: 'i'}}
                        ]
                    },
                    {
                        $set: {
                            "metrics.supply": it.latest_supply
                        }
                    });
            });
            if (buckets[0].latest_supply.hits) {
                currentData.meta.timestamp = buckets[0].latest_supply.hits.hits[0].sort[0];
            }
        },
        averages_l15: function (result) {
            if (!result || !result.aggregations || !result.aggregations.by_system || !result.aggregations.by_system.buckets)
                return;
            var buckets = result.aggregations.by_system.buckets; //todo: resolve this crap using smth built into queries.

            _.each(buckets, function (bucket) {
                bucket.key = _normKey(bucket.key);
                if (!currentData[bucket.key]) currentData[bucket.key] = {};
                var it = currentData[bucket.key];

                //console.log(bucket);//.latest_supply.hits.hits[0]._source.supply_current;
                it.avg_cap_usd = bucket.avg_cap_usd.value;
                it.avg_cap_btc = bucket.avg_cap_btc.value;

                var reg = new RegExp('^' + CF.Utils.escapeRegExp(bucket.key));
                CurrentData.update({
                        $or: [
                            {"aliases.CoinMarketCap": {$regex: reg, $options: 'i'}},
                            {"name": {$regex: reg, $options: 'i'}}
                        ]
                    },
                    {
                        $set: {
                            "metrics.cap.usd": it.avg_cap_usd,
                            "metrics.cap.btc": it.avg_cap_btc
                        }
                    });
            });
        }
    }
    ;

function fetchLatest() {
    var result = CF.Utils.extractFromPromise(CF.ES.sendQuery("latest_values"));
    esParsers.latest_values(result)
}

function fetchAverage15m() {
    var result = CF.Utils.extractFromPromise(CF.ES.sendQuery("averages_last_15m"));
    esParsers.averages_l15(result);

}
Meteor.startup(function () {
    //  Meteor.setTimeout(
    //    function () {
    fetchLatest();
    Meteor.setInterval(fetchLatest, 300000);
    //  }, 4000);

    Meteor.setTimeout(
        function () {
            fetchAverage15m();
            Meteor.setInterval(fetchAverage15m, 300000);
        }, 12000);
});

Meteor.methods({
    "print_currentData": function () {
        console.log(currentData);
    }
});