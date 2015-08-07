/**
 * Created by angelo on 8/7/15.
 */
var fetch = function(){
  try {
    var res = HTTP.get("https://etherchain.org/api/basic_stats");
    if (!res.data) return;
    var data = res.data;
    if (data.status ==  1) {
      data = data.data;
      var blockCount = data.blockCount ? data.blockCount.number : data.difficulty ? data.difficulty.number : 0;
      if (blockCount) {
        var selector = {system: "Ethereum"};
        var metrics = CurrentData.findOne(selector);
        if (metrics.metrics) {
          metrics = metrics.metrics;
          var supply = blockCount*5 + 72002454.768;
          var set = {
            'metrics.supply': supply,
            'metrics.cap.btc': metrics.price.btc *supply,
            'metrics.cap.usd': metrics.price.usd *supply
          };
          CurrentData.update(selector, {$set: set});
        }
      }
    } else  {
      console.log("received status " +data.status + " when fetched etherium basic stats. no update.")
    }
  } catch (e) {
    console.log("cannot fetch etherium data");
    return;
  }
};

SyncedCron.add({
  name: 'fetch etherium volume data',
  schedule: function (parser) {
    // parser is a later.parse object
    return parser.cron('5/15 * * * * *', true)
  },
  job: function () {
    fetch();
  }
});