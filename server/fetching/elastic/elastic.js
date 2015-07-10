var currentData = {meta: {}};
var logger = log4js.getLogger("meteor-fetching-es");

var latestDep = new Tracker.Dependency;
function _normKey(str){ //thing is, elasticsearch by default returns long string as (first 15 symbols + '...')
    // not sure yet how to force it returning full key, so for now just cutting result + searching by "starts_with"
    return str.slice(0,15);
}

var esParsers = {
    errorLogger: function esErrorHandler(rejection) {
        logger.error(rejection);
    },
    latest_values: function parseLatestValues(result) {
        //obviously, this is a data parser for aggregation.
        if (!result || !result.aggregations || !result.aggregations.by_system || !result.aggregations.by_system.buckets)
            return;
        var buckets = result.aggregations.by_system.buckets; //todo: resolve this crap using smth built into queries.

        //console.log(buckets[0].latest_supply.hits.hits);

        _.each(buckets, function (bucket) {
            bucket.key = _normKey(bucket.key);
            if (!currentData[bucket.key]) currentData[bucket.key] = {};
            var it = currentData[bucket.key];
            it.latest_supply = bucket.latest_supply.hits.hits[0]._source.supply_current;
            //console.log(currentData);
        });
        if (buckets[0].latest_supply.hits)
            currentData.meta.timestamp = buckets[0].latest_supply.hits.hits[0].sort[0];
        //console.log(currentData);
    },
    averages_l15: function (result) {
        if (!result || !result.aggregations || !result.aggregations.by_system || !result.aggregations.by_system.buckets)
            return;
        var buckets = result.aggregations.by_system.buckets; //todo: resolve this crap using smth built into queries.
       // console.log(buckets[0]);
        _.each(buckets, function (bucket) {
            bucket.key = _normKey(bucket.key);
            if (!currentData[bucket.key]) currentData[bucket.key] = {};
            var it = currentData[bucket.key];

            //console.log(bucket);//.latest_supply.hits.hits[0]._source.supply_current;
            it.avg_cap_usd = bucket.avg_cap_usd.value;
            it.avg_cap_btc = bucket.avg_cap_btc.value;
            //console.log(currentData);
        });
    }
};

function fetchLatest() {
    CF.ES.sendQuery("latest_values"/*, {system: "Bitcoin"}*//*, {systems: ["Bitcoin", "Namecoin"]}*/)
        .then(esParsers.latest_values, esParsers.errorLogger)
}

function fetchAverage15m() {
    CF.ES.sendQuery("averages_last_15m"/*, {systems: ["Bitcoin", "Namecoin"]}*/).then(esParsers.averages_l15, esParsers.errorLogger);
}
Meteor.startup(function () {
  //  Meteor.setTimeout(
    //    function () {
            fetchLatest();
      //      Meteor.setInterval(fetchLatest, 300000);
      //  }, 4000);

  //  Meteor.setTimeout(
    //    function () {
            fetchAverage15m();
      //      Meteor.setInterval(fetchAverage15m, 300000);
      //  }, 12000);
});

Meteor.methods({
    "print_currentData": function(){
        console.log(currentData);
    }
});