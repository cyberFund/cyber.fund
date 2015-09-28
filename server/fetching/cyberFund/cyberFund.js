var sourceUrl = "https://raw.githubusercontent.com/cyberFund/chaingear/gh-pages/chaingear.json";
var fetchInterval = 5 * 60 * 1000;

var logger = log4js.getLogger("meteor-fetching");

CF.fetching.cyberFund = {};

CF.fetching.cyberFund.processData = function (data, callback) {
  var timestamp = moment().unix();

  var processedData = data.map(function (system) {
    system.source = "cyberFund";
    system.timestamp = timestamp;
    return system;
  });

  callback(null, processedData);
};

/**
 *
 * @param obj
 * @returns {{}} object with keys flattened. ok to use in conjunction with
 * collection.update({..}, {$set: flatten(obj)})
 */
function flatten(obj) { //todo move to utils..
  if (!_.isObject(obj)) return;

  var result = {};

  function add(key, prop) {
    result[key] = prop;
  }

  function iter(currentKey, object) {
    _.each(object, function (v, k) {

      var key = currentKey ? currentKey + "." + k : k;
      if (_.isArray(v)) {
        add(key, v);
      } else {
        if (_.isObject(v)) {
          iter(key, v)
        } else {
          add(key, v)
        }
      }
    })
  }

  iter("", obj);
  return result;
}

var fetch = function () {
    logger.info("Fetching data from cyberFund...");
    try {
      var res = HTTP.call("HEAD", sourceUrl, {timeout: fetchInterval});
      var previous = Extras.findOne({_id: 'chaingear_etag'});
      if (!res || !res.headers || !res.headers.etag) return;
      if (!previous || (previous.etag != res.headers.etag)) {
        logger.info("new etag for chaingear - " + res.headers.etag + "; fetching chaingear");

        CF.fetching.get(sourceUrl, {timeout: fetchInterval}, function (error, getResult) {
          if (error) {
            logger.error("Error while fetching cyberfund:", error);
            return;
          }
          //if (CurrentData.find().count() < 1000) {
          _.each(getResult, function (system) {
            if (!system.token) {
              logger.info("no .token for system '" + system.system + "'");
              return;
            }
            var selector = CF.CurrentData.selectors.system_symbol(system.system, system.token.token_symbol);
            var doc = CurrentData.findOne(selector);
            if (!doc) {
              if (system.specs && (system.specs.supply || system.specs.cap)) {
                // push supply & caps to metrics
                system.metrics = system.metrics || {};
                system.metrics.supply = system.specs.supply;
                system.metrics.cap = system.specs.cap

              }
              console.log("inserting system " + system.system);
              CurrentData.insert(system);
            }
            else {
              var set = _.omit(system, ['system', 'symbol']);
              if (system.crowdsales) {
                if (_.isString(system.crowdsales.start_date)) {
                  system.crowdsales.start_date = moment(system.crowdsales.start_date, "YYYY-MM-DD[T]hh:mm:ss")._d;
                }
                if (_.isString(system.crowdsales.end_date)) {
                  system.crowdsales.end_date = moment(system.crowdsales.end_date, "YYYY-MM-DD[T]hh:mm:ss")._d;
                }
              }
              // push supply & caps to metrics
              if (system.specs) {
                if (system.specs.supply) {
                  set["metrics.supply"] = system.specs.supply;
                }
                if (system.specs.cap) {
                  set["metrics.cap.usd"] = system.specs.cap.usd;
                  set["metrics.cap.btc"] = system.specs.cap.btc;
                }

                // check if we can hotfix price
                if (system.specs.cap && system.specs.supply ) {
                  // check if need hotfixing price
                  if (!doc.metrics || !doc.metrics.price || !doc.metrics.price.usd || !doc.metrics.price.btc) {
                    if (!doc.metrics || !doc.metrics.price || !doc.metrics.price.usd && system.specs.cap.usd) {
                      set["metrics.price.usd"] = system.specs.cap.usd / system.specs.supply;
                    }
                    if (!doc.metrics || !doc.metrics.price || !doc.metrics.price.btc && system.specs.cap.btc) {
                      set["metrics.price.btc"] = system.specs.cap.btc / system.specs.supply;
                    }
                  }
                }
              }

              var modifier = {$set: set};

              CurrentData.upsert(selector, modifier);
            }
          });
        });
        Extras.upsert({_id: 'chaingear_etag'}, {etag: res.headers.etag});
      }
      else {
        console.log("chaingear not changed..")
      }
    }
    catch
      (e) {
      console.log("probably no connection while trying to fetch cynberfund")
    }
  }
  ;

SyncedCron.add({
  name: 'fetch chaingear data',
  schedule: function (parser) {
    // parser is a later.parse object
    return parser.cron('1/5 * * * *', false);
  },
  job: function () {
    fetch();
  }
});

