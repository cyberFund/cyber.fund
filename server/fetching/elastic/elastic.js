// this file describes fetching data from our elasticsearch servers
// (currently, it s coinmarketcap data)

//var currentData = {meta: {}};
var logger = log4js.getLogger("meteor-fetching-es");

function _normKey(str) { //thing is, elasticsearch by default returns long string as (first 15 symbols + '...')
                         // not sure yet how to force it returning full key, so for now just cutting result + searching by "starts_with"
  return str.slice(0, 15);
}

function _searchSelector(bucketKey) {

  // sym_sys is alike 'SYMBL|System'
  bucketKey = bucketKey.split("|");
  var selector = {};
  if (bucketKey.length == 2) {
    var symbol = bucketKey[0];
    bucketKey = bucketKey[1];

  } else {
    bucketKey = bucketKey[0];
  }

  //elasticsearch returns first 15 symbols + "..." if system name is longer than 15 symbols...
  if (bucketKey.slice(-3) == "...") {
    bucketKey = bucketKey.slice(0, -3);
    bucketKey = {
      $regex: new RegExp('^' + CF.Utils.escapeRegExp(bucketKey)),
      $options: 'i'
    };
  } else {
  }
  selector = {"system": bucketKey};

  selector["token.token_symbol"] = symbol;
  return selector;
}

JSON.unflatten = function (data) {
  "use strict";
  if (Object(data) !== data || Array.isArray(data)) {
    return data;
  }
  var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
    resultholder = {};
  for (var p in data) {
    var cur = resultholder,
      prop = "",
      m;
    while (m = regex.exec(p)) {
      cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
      prop = m[2] || m[1];
    }
    cur[prop] = data[p];
  }
  return resultholder[""] || resultholder;
};

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
      if (!_.isArray(buckets)) return;
      logger.info("latest values fetched: total of " + buckets.length + " buckets");

      var notFounds = [];
      _.each(buckets, function (bucket) {

          // elasticsearch returns 'date range' buckets in custom order,
          // not corresponding to order they were defined. it looks depending on sort order by timestamp, used inside
          // inner aggregations, so best is to explicitly get buckets.
          // here we use bucket with max 'to' value as current, next bucket is 'day ago' bucket.. same as defined in aggregation..
          var index = _.map(bucket.by_time.buckets, function (item) {
            return item.to;
          });

          // current
          var mx = _.max(index);
          var m = moment.utc(mx);
          var stamp = {
            day: m.date(),
            hour: m.hours(),
            minute: m.minutes()
          };

          //
          var timestamp = m._d;
          var current = _.find(bucket.by_time.buckets, function (item) {
            return item.to == mx;
          });

          // day ago
          index = _.without(index, mx);
          mx = _.max(index);
          var dayAgo = _.find(bucket.by_time.buckets, function (item) {
            return item.to == mx;
          });

          //
          // updating CurrentData (metrics, mainly)
          //
          var set = {},// changes object, to be used within doc update
            sNow = {}, // current day
            sDayAgo = {}, // past day data
            sWeekAgo = {}; // not used so far
          // 0.
          // calculating sNow, sDayAgo
          //

          if (_.isArray(current.latest.hits.hits) && current.latest.hits.hits.length > 0) {
            sNow = current.latest.hits.hits[0]._source;
          }

          if (_.isArray(dayAgo.latest.hits.hits) && dayAgo.latest.hits.hits.length > 0) {
            sDayAgo = dayAgo.latest.hits.hits[0]._source;
          }

          if (_.isEmpty(sNow)) return; // no need to update if no new data

          // current document, so we can take some values if none in fetched data
          var curDoc = CurrentData.findOne(_searchSelector(bucket.key), {
            fields: {
              dailyData: 0,
              hourlyData: 0
            }
          });

          // what we use as a data source. is set in chaingear, per-coin/per-asset
          var supplyDataSource = (curDoc && curDoc.token && curDoc.token.supply_from) || 'cmc';

          // overriding supply data source.
          if (curDoc && curDoc.flags && curDoc.flags.suplly_from_here) {
            supplyDataSource = 'chg';
          }

          // 1.
          // sNow.supply_current

          // use chaingear specified value if supplyDataSource is chg
          if (supplyDataSource == "chg") {
            sNow.supply_current = (curDoc.specs && curDoc.specs.supply) || 0;
            if (sDayAgo) sDayAgo.supply_current = sNow.supply_current;
          }

          // try using existing supply value if none or 0 here
          if (!sNow.supply_current) {
            if (curDoc) {
              sNow.supply_current = curDoc.metrics && curDoc.metrics.supply || 0;
              if (!sNow.supply_current) sNow.supply_current = curDoc.specs && curDoc.specs.supply || 0;
            }
          }

          // 2. sNow.prices
          //

          // if no price - used latest from doc
          if (!sNow.price_usd) {
            sNow.price_usd = curDoc.metrics.price.usd;
          }

          // if no price - used latest from doc
          if (!sNow.price_btc) {
            sNow.price_btc = curDoc.metrics.price.btc;
          }


          // if price - store it, calculate diffs
          if (sNow.price_usd) {
            set["metrics.price.usd"] = sNow.price_usd;
            if (sDayAgo.price_usd) {
              set["metrics.priceChangePercents.day.usd"] = 100.0 *
                (sNow.price_usd - sDayAgo.price_usd) / sNow.price_usd;
              set["metrics.priceChange.day.usd"] = sNow.price_usd - sDayAgo.price_usd;
            }
            // calculate cap from supply and store it;
            if (sNow.supply_current) {
              sNow.cap_btc = sNow.supply_current * sNow.price_btc
            }
          }

          // if price - store it, calculate diffs
          if (sNow.price_btc) {
            set["metrics.price.btc"] = sNow.price_btc;
            if (sDayAgo.price_btc) {
              set["metrics.priceChangePercents.day.btc"] = 100.0 *
                (sNow.price_btc - sDayAgo.price_btc) / sNow.price_btc;
              set["metrics.priceChange.day.btc"] = sNow.price_btc - sDayAgo.price_btc;
            }
            // calculate cap from supply and store it;
            if (sNow.supply_current) {
              sNow.cap_usd = sNow.supply_current * sNow.price_usd
            }
          }

          var capBtc;

          // 3.
          // now that we tried to fix prices, let s check again if we can fix supply from cap & prices
          // not sure if needed..

          if (!sNow.supply_current) {
            capBtc = sNow.cap_btc ||
              (curDoc && curDoc.metrics && curDoc.metrics.cap && curDoc.metrics.cap.btc);
            if (curDoc && curDoc.metrics && curDoc.metrics.price && curDoc.metrics.price.btc) {
              set["metrics.supply"] = capBtc / sNow.price_btc;
              sNow.supply_current = capBtc / sNow.price_btc;
            }
          }


          // if supply value is here
          if (sDayAgo.supply_current) {

            // try count cap using price and supply
            // if (sDayAgo.price_usd) {
            sDayAgo.cap_usd = sDayAgo.supply_current * (sDayAgo.price_usd || sNow.price_usd);
            // }

            // try count cap using price and suuply
            //  if (sDayAgo.price_btc) {
            sDayAgo.cap_btc = sDayAgo.supply_current * (sDayAgo.price_btc || sNow.price_usd);
            // }
          }


          // if supply value is here
          if (sNow.supply_current) {
            // try count cap (if none) using price and supply
            if (sNow.price_usd) {
              sNow.cap_usd = sNow.supply_current * sNow.price_usd;
            }

            // try count cap (if none) using price and suuply
            if (sNow.price_btc) {
              sNow.cap_btc = sNow.supply_current * sNow.price_btc;
            }

            set["metrics.supply"] = sNow.supply_current;
            if (sDayAgo.supply_current) {
              var supplyDayAgo = sDayAgo.supply_current// || sNow.supply_current;
              set["metrics.supplyChangePercents.day"] = 100.0 *
                (sNow.supply_current - supplyDayAgo) / sNow.supply_current;

              set["metrics.supplyChange.day"] = sNow.supply_current - supplyDayAgo;
            }
          }


          if (sNow.cap_usd) {
            set['metrics.cap.usd'] = sNow.cap_usd;
          }
          if (sNow.cap_btc) {
            set['metrics.cap.btc'] = sNow.cap_btc;
          }

          if (sNow.volume24_btc) {
            set["metrics.tradeVolume"] = sNow.volume24_btc;
            capBtc = sNow.cap_btc || (curDoc && curDoc.metrics && curDoc.metrics.cap && curDoc.metrics.cap.btc);
            if (capBtc && sNow.volume24_btc) {
              set["metrics.turnover"] = (0.0 + sNow.volume24_btc) / capBtc;
            } else {
              set["metrics.turnover"] = 0.0;
            }

            if (sDayAgo.volume24_btc) {
              set["metrics.tradeVolumePrevious.day"] = sDayAgo.volume24_btc;
            }
          }

          if (sNow.cap_usd && sDayAgo.cap_usd) {
            set["metrics.capChangePercents.day.usd"] = 100.0 *
              (sNow.cap_usd - sDayAgo.cap_usd) / sNow.cap_usd;
            set["metrics.capChange.day.usd"] = sNow.cap_usd - sDayAgo.cap_usd;
          }

          if (sNow.cap_btc && sDayAgo.cap_btc) {
            set["metrics.capChangePercents.day.btc"] = 100.0 *
              (sNow.cap_btc - sDayAgo.cap_btc) / sNow.cap_btc;
            set["metrics.capChange.day.btc"] = sNow.cap_btc - sDayAgo.cap_btc;
          }

          // those are used to build daily charts
          if (!_.isEmpty(set) && curDoc) {
            set.updatedAt = new Date();
            // console.log(set);
            /*if (curDoc && curDoc.flags && curDoc.flags.suplly_from_here) {
             set['metrics.supply'] = curDoc.specs.supply;
             set['metrics.cap.btc'] = curDoc.specs.supply * set['metrics.price.btc'];
             set['metrics.cap.usd'] = curDoc.specs.supply * set['metrics.price.usd'];
             }*/
            CurrentData.update(_searchSelector(bucket.key), {$set: set});
            var fastMetric = _.pick(sNow, [
              "cap_usd", "cap_btc", "volume24_btc", "price_usd", "volume24_usd", "price_btc"]);
            fastMetric.systemId = curDoc._id;
            fastMetric.timestamp = timestamp;
            fastMetric.stamp = stamp;
            FastData.insert(fastMetric)
          }

        }
      );
      if (notFounds.length) {
        logger.warn("not found any currentData for ");
        logger.warn(notFounds);
      }
    },

    averages_l15: function (result) {
      if (!result || !result.aggregations || !result.aggregations.by_system || !result.aggregations.by_system.buckets) {
        return;
      }
      var buckets = result.aggregations.by_system.buckets; //todo: resolve this crap using smth built into queries.

      _.each(buckets, function (bucket) {
        var findSel = _searchSelector(bucket.key),
          set = {};

        // if (bucket.avg_cap_usd.value) set["metrics.cap.usd"] = bucket.avg_cap_usd.value;
        // if (bucket.avg_cap_btc.value) set["metrics.cap.btc"] = bucket.avg_cap_btc.value;
        if (!_.isEmpty(set)) {
          try {
            CurrentData.update(_searchSelector(bucket.key), {$set: set});
          } catch (e) {
            console.log('could not update currentData: ');
            console.log(e);
            console.log(_searchSelector(bucket.key));
            console.log(set)
          }
        } else {
          // logger.info("no averages for " + bucket.key);
        }
      });
    }

    ,
    averages_date_hist: function (result, params) {
      var daily = params.interval == "day";
      var hourly = params.interval == "hour";

      if (!hourly && !daily) {
        console.warn("averages_date_hist es parser: ");
        console.warn("only 'hour' and 'day' currently supported as intervals for data");
        console.log();
      }

      if (!result || !result.aggregations || !result.aggregations.by_system
        || !result.aggregations.by_system.buckets) {
        this.errorLogger(result);
        return;
      }

      var buckets = result.aggregations.by_system.buckets; //todo: resolve this crap using smth built into queries.
      if (!_.isArray(buckets)) return;

      var notFounds = [];
      _.each(buckets, function (sysBucket) {
        var systemKey = sysBucket.key;
        var id = CurrentData.findOne(_searchSelector(systemKey));
        if (!id) {
          notFounds.push(sysBucket.key);
          return;
        }
        id = id._id;
        if (daily) _key = "dailyData";
        if (hourly) _key = "hourlyData";
        if (!sysBucket.over_time || !sysBucket.over_time.buckets || !_.isArray(sysBucket.over_time.buckets)) {
          return;
        }

        // apply changes to currentData
        var set = {};

        _.each(sysBucket.over_time.buckets, function (timeBucket) {
          if (!timeBucket.key_as_string) return;
          var utc = moment.utc(timeBucket.key_as_string);
          if (!utc) return;

          function grab(timeBucket) {
            var ret = {};
            _.each(["cap_usd", "cap_btc", "volume24_btc",
              "price_usd", "volume24_usd", "price_btc"], function (k) {
              ret[k] = timeBucket[k].value;
            });
            return ret;
          }

          var key;
          if (daily) key = [_key, utc.year(), utc.month(), utc.date()].join(".");
          if (hourly) key = [_key, utc.year(), utc.month(), utc.date(), utc.hour()].join(".");
          set[key] = grab(timeBucket);

        });
        if (!_.isEmpty(set)) {
          CurrentData.update({_id: id}, {$set: set});
        } else {
        }
      });
    }
  }
  ;

function fetchLatest(params) {
  try {
    var result = CF.Utils.extractFromPromise(CF.ES.sendQuery("latest_values", params));
    esParsers.latest_values(result)
  } catch (e) {
    logger.warn("could not fetch latest values");
    logger.warn(e);
    return e;
  }
}

function fetchAverage15m(params) {
  try {
    var result = CF.Utils.extractFromPromise(CF.ES.sendQuery("averages_last_15m", params));
    esParsers.averages_l15(result);
  } catch (e) {
    logger.warn("could not fetch latest_!5m_averages");
    logger.warn(e);
    throw(e)
  }
}

function fetchAverages(params) {
  var result = CF.Utils.extractFromPromise(CF.ES.sendQuery("average_values_date_histogram", params));
  esParsers.averages_date_hist(result);
}
/*
 Meteor.startup(function () {
 var countHourlies = CurrentData.find({"hourlyData": {$exists: true}}).count();
 var countDailies = CurrentData.find({"dailyData": {$exists: true}}).count();

 var params = {
 from: "now-1d/d",
 to: "now/d",
 interval: "day"
 };

 //var result = CF.Utils.extractFromPromise(CF.ES.sendQuery("average_values_date_histogram", params));
 //  esParsers.averages_date_hist(result, params);

 });
 */

SyncedCron.add({
  name: 'fetch last hour averages',
  schedule: function (parser) {
    return parser.cron('4 * * * *', false);
  },
  job: function () {
    var params = {
      from: "now-1h/h",
      to: "now/h",
      interval: "hour"
    };
    var result = CF.Utils.extractFromPromise(CF.ES.sendQuery("average_values_date_histogram", params));
    esParsers.averages_date_hist(result, params);
  }
});

SyncedCron.add({
  name: 'fetch last day averages',
  schedule: function (parser) {
    return parser.cron('6 0 * * *', false);
  },
  job: function () {
    var params = {
      from: "now-1d/d",
      to: "now/d",
      interval: "day"
    };
    var result = CF.Utils.extractFromPromise(CF.ES.sendQuery("average_values_date_histogram", params));
    esParsers.averages_date_hist(result, params);
  }
});

Meteor.methods({
  "initAverageValues": function (curDataId) {
    var curDataDoc = CurrentData.findOne({_id: curDataId});
    if (!curDataDoc || curDataDoc.initializedAverages || !curDataDoc.token) return; //only shoot once. like a real panda.

    var system = curDataDoc.token.token_symbol + "|" + curDataDoc.system;
    // fetch dailies for 30 last days
    var params = {
      from: "now-4y/d",
      to: "now/d",
      interval: "day",
      system: system
    };
    try {
      var result = CF.Utils.extractFromPromise(CF.ES.sendQuery("average_values_date_histogram", params));
      esParsers.averages_date_hist(result, params);

      // fetch hourlies for past week;
      params = {
        from: "now-30d/h",
        to: "now/h",
        interval: "hour",
        system: system
      };
      try {
        result = CF.Utils.extractFromPromise(CF.ES.sendQuery("average_values_date_histogram", params));
        esParsers.averages_date_hist(result, params);

        CurrentData.update({_id: curDataId}, {$set: {initializedAverages: true}});
      } catch (e) { // if something went wrong - just do not set flag
        logger.warn("couinld not fetch average_values_date_histogram hourly");
        logger.warn(e);
        return;
      }
    } catch (e) {
      logger.warn("couinld not fetch average_values_date_histogram daily");
      logger.warn(e);
      return; // just do not set flag if something went wrong
    }
  }
});

SyncedCron.add({
  name: 'fetch latest elasticsearch data',
  schedule: function (parser) {
    // parser is a later.parse object
    return parser.cron('3/5 * * * *', false);
  },
  job: function () {
    try {
      fetchAverage15m();
    } catch (e) {
      console.log('could not fetch elastic data (15m averages)')
    }
  }
});


SyncedCron.add({
  name: 'fetch avegares 15m elasticsearch data',
  schedule: function (parser) {
    // parser is a later.parse object
    return parser.cron('1/5 * * * *', false);
  },
  job: function () {
    try {
      fetchLatest();
    } catch (e) {
      console.log('could not fetch elastic data (latest)')
    }
  }
});


var saveTotalCap = function () {

  var calcTotalCap = function () {
    function isAutonomous(item){
      return !item.dependencies || item.dependencies == 'independent' || item.dependencies.indexOf('independent')>=0
    }
    var cap = 0;
    var autonomous = 0;
    var dependent = 0;
    CurrentData.find({}, {
      'metrics.cap': 1,
      'dependencies': 1
    }).forEach(function (sys) {
      if (sys.metrics && sys.metrics.cap && sys.metrics.cap.btc) {
        cap += sys.metrics.cap.btc;
        if (isAutonomous(sys)) {
          autonomous++;
        } else {
          dependent++;
        }
      }
    });
    return {btc: cap, autonomous: autonomous, dependent: dependent}
  };
  var cap = calcTotalCap();
  var btcPrice = CurrentData.findOne({system:"Bitcoin"}, {fields: {"metrics": 1}});
  if (btcPrice) btcPrice = btcPrice.metrics && btcPrice.metrics.price && btcPrice.metrics.price.usd
  if (cap) {
    Extras.upsert({_id: 'total_cap'}, _.extend(cap, { usd: cap.btc * btcPrice}));
  }
};

Meteor.startup(function () {
  saveTotalCap();
})

SyncedCron.add({
  name: 'total btc cap',
  schedule: function (parser) {
    // parser is a later.parse object
    return parser.cron('* 1 * * *', false);
  },
  job: function () {
    try {
      saveTotalCap()
    } catch (e) {
      console.log('could not fetch elastic data (latest)')
    }
  }
});

Meteor.methods({
  "print_currentData": function () {
    console.log(currentData);
  }
});