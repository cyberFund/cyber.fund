/**
 * Created by angelo on 8/7/15.
 */
const print = CF.Utils.logger.getLogger("Ethereum").print;
var fetch = function() {
  try {
    var res = HTTP.get("http://kong.cyber.fund/Ethereum/supply");
    //http://kong.cyber.fund/Ethereum/supplies
    if (!res.data) return;
    var data = JSON.parse(res.data);
    //if (data.status ==  1) {
    //data = data.data;

    //var blockCount = data.blockCount ? data.blockCount.number : //data.difficulty ? data.difficulty.number : 0;
    var blockCount = data.blockNumber;

    if (blockCount) {
      print("Geth blocks", blockCount, true)
      var selector = {
        _id: "Ethereum"
      };
      var metrics = CurrentData.findOne(selector);
      if (metrics.metrics) {
        metrics = metrics.metrics;
        const supply = blockCount * 5 + 72002454.768;
        const set = {
          "metrics.supply": supply,
          "metrics.cap.btc": metrics.price.btc * supply,
          "metrics.cap.usd": metrics.price.usd * supply
        };
        CurrentData.update(selector, {
          $set: set
        });
      }

      if (data.supply) {
        _.each(data.supply, (it, key) => {
          const selector = {
            _id: key
          }
          const system = CurrentData.findOne(selector);
          if (system) {
            const set = {
              "metrics.supply": it,
              "flags.supply_from": "geth"
            }
            CurrentData.update(selector, {
              $set: set
            });
          }
        });
      }
    }
    //} else  {
    //  console.log("received status " +data.status + " when fetched etherium basic stats. no update.");
    //}
  } catch (e) {
    console.log("cannot fetch etherium data");
    return;
  }
};

SyncedCron.add({
  name: "fetch etherium volume data",
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.cron("5/15 * * * * *", true);
  },
  job: function() {
    fetch();
  }
});
