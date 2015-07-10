var currentData = {};
var logger = log4js.getLogger("meteor-fetching-es");
function fetchLatest(){
    CF.ES.sendQuery("latest_values"/*, {system: "Bitcoin"}*/, {systems: ["Bitcoin", "Namecoin"]}).then(function (result){

        //obviously, this is a data parser for aggregation.
        if (!result || !result.aggregations || !result.aggregations.by_system || !result.aggregations.by_system.buckets)
            return;
        var buckets = result.aggregations.by_system.buckets; //todo: resolve this crap using smth built into queries.

        console.log(buckets);
        _.each(buckets)
    }, function(rejection){
        logger.error(rejection);
    })
}

function fetchAverage15m(){
    CF.ES.sendQuery("averages_15m_full")
}
Meteor.startup(function() {
    fetchLatest();
});