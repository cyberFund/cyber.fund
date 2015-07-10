//var currentData = {meta: {}};
var logger = log4js.getLogger("meteor-fetching-es");

function _normKey(str) { //thing is, elasticsearch by default returns long string as (first 15 symbols + '...')
    // not sure yet how to force it returning full key, so for now just cutting result + searching by "starts_with"
    return str.slice(0, 15);
}

function _searchSelector(bucketKey) { //elasticsearch returns first 15 symbols + "..." if system name is longer than 15 symbols...
    // i wish i knew how to change this
    if (bucketKey.slice(-3) == "...") {
        bucketKey = bucketKey.slice(0, -3);
        var reg = new RegExp('^' + CF.Utils.escapeRegExp(bucketKey));
        return {
            $or: [
                {"aliases.CoinMarketCap": {$regex: reg, $options: 'i'}},
                {"name": {$regex: reg, $options: 'i'}}]
        };
    }
    return {
        $or: [
            {"aliases.CoinMarketCap": bucketKey},
            {"name": bucketKey}]
    };
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
            var findSel = _searchSelector(bucket.key),
                set = {},
                source = bucket.latest.hits.hits[0]._source;

            //todo: use same set of keys at CF.ES.queries.latest_Values
            //_.each(["supply_current", "price_usd", "price_btc", "volume24_btc", "volume24_usd"],
            if (source.supply_current) set["metrics.supply"] = source.supply_current;
            if (source.price_usd) set["metrics.price.usd"] = source.price_usd;
            if (source.price_btc) set["metrics.price.btc"] = source.price_btc;
            if (source.volume24_btc) set["metrics.tradeVolume"] = source.volume24_btc;
            if (!_.isEmpty(set))
                CurrentData.update(_searchSelector(bucket.key), {$set: set});
        });
    },
    averages_l15: function (result) {
        if (!result || !result.aggregations || !result.aggregations.by_system || !result.aggregations.by_system.buckets)
            return;
        var buckets = result.aggregations.by_system.buckets; //todo: resolve this crap using smth built into queries.

        _.each(buckets, function (bucket) {
            var findSel = _searchSelector(bucket.key),
                set = {};

            if (bucket.avg_cap_usd.value) set["metrics.cap.usd"] = bucket.avg_cap_usd.value;
            if (bucket.avg_cap_btc.value) set["metrics.cap.btc"] = bucket.avg_cap_btc.value;
            if (!_.isEmpty(set))
                CurrentData.update(_searchSelector(bucket.key), {$set: set});
        });
    }
};

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