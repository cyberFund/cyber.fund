import {CurrentData, Extras} from '/imports/api/collections'
import winston from 'winston'
import {extractFromPromise} from '/imports/api/server/utils'
import cfEs from '/imports/api/server/cfEs'
// this file describes fetching data from our elasticsearch servers
// (currently, it s coinmarketcap data)

//var currentData = {meta: {}};
var epoch = new Date("2000-01-01 00:00:00.000").valueOf(); //946677600000

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
      $regex: new RegExp("^" + CF.Utils.escapeRegExp(bucketKey)),
      $options: "i"
    };
  } else {}
  selector = {
    "_id": bucketKey
  };

  selector["token.symbol"] = symbol;
  return selector;
}

const handleArrayWithInterval = require(
  "/imports/api/handleArray").handleArrayWithInterval;

JSON.unflatten = function(data) {
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

  latest_values: function parseLatestValues(today, yesterday, monthAgo) {
    function getBuckets (day) {
      // could probably check for some es flags.
      return day.aggregations && day.aggregations.by_system
      && day.aggregations.by_system.buckets || null;
    }

    function getHit(bucket) {
      // get the data
      return bucket && bucket.latest && bucket.latest.hits &&
      bucket.latest.hits.hits[0]
      && bucket.latest.hits.hits[0]._source || null;
    }

    function getSameBucket(dayBuckets, key){
      // search by key in results of another timerange
      return _.find(dayBuckets, function(dB){ return dB.key === key;});
    }

    var todayBuckets = getBuckets (today);
    var yesterdayBuckets = getBuckets (yesterday);
    var monthAgoBuckets = getBuckets (monthAgo);

    console.log ("total of " + todayBuckets.length + " buckets");
    var notFounds = [];

    handleBucket = function handleBucket(bucket) {
      var sNow = getHit(bucket);

      if (_.isEmpty(sNow)) return; // no need to update if no new data

      // past day data
      var sDayAgo = getHit( getSameBucket(yesterdayBuckets, bucket.key) );
      var sMonthAgo = getHit( getSameBucket(monthAgoBuckets, bucket.key) );

      var set = {}; // changes object, to be used within doc update
      var m = moment(sNow.timestamp);
      var timestamp = m._d;

      var stamp = { // no need after switching from chartist to highcharts..
        day: m.date(),
        hour: m.hours(),
        minute: m.minutes()
      };

      // current document, so we can take some values if none in fetched data
      var curDoc = CurrentData.findOne(_searchSelector(bucket.key), {
        fields: {
          dailyData: 0,
          hourlyData: 0
        }
      });
      // what we use as a data source. is set in chaingear, per-coin/per-asset
      var supplyDataSource = (curDoc && curDoc.token && curDoc.flags && curDoc.flags.supply_from) || "cmc";

      // overriding supply data source.
      if (curDoc && curDoc.flags && curDoc.flags.supply_from_here) {
        supplyDataSource = "chg";
      }

      // 1.
      // sNow.supply_current

      // use chaingear specified value if supplyDataSource is chg
      if (supplyDataSource == "chg") {
        sNow.supply_current = (curDoc.specs && curDoc.specs.supply) || 0;
        if (sDayAgo) sDayAgo.supply_current = sNow.supply_current;
        if (sMonthAgo) sMonthAgo.supply_current = sNow.supply_current;
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
        sNow.price_usd = curDoc.metrics && curDoc.metrics.price && curDoc.metrics.price.usd;
      }

      // if no price - used latest from doc
      if (!sNow.price_btc) {
        sNow.price_btc = curDoc.metrics && curDoc.metrics.price && curDoc.metrics.price.btc;
      }

      // if price - store it, calculate diffs
      if (sNow.price_usd) {
        set["metrics.price.usd"] = sNow.price_usd;
        if (sDayAgo && sDayAgo.price_usd) {
          set["metrics.priceChangePercents.day.usd"] = 100.0 *
            (sNow.price_usd - sDayAgo.price_usd) / sNow.price_usd;
          set["metrics.priceChange.day.usd"] = sNow.price_usd - sDayAgo.price_usd;
        }

        if (sMonthAgo && sMonthAgo.price_usd) {
          set["metrics.priceChangePercents.month.usd"] = 100.0 *
            (sNow.price_usd - sMonthAgo.price_usd) / sNow.price_usd;
          set["metrics.priceChange.month.usd"] = sNow.price_usd - sMonthAgo.price_usd;
        }

        // calculate cap from supply and store it;
        if (sNow.supply_current) {
          sNow.cap_btc = sNow.supply_current * sNow.price_btc;
        }
      }

      // if price - store it, calculate diffs
      if (sNow.price_btc) {
        set["metrics.price.btc"] = sNow.price_btc;
        if (sDayAgo && sDayAgo.price_btc) {
          set["metrics.priceChangePercents.day.btc"] = 100.0 *
            (sNow.price_btc - sDayAgo.price_btc) / sNow.price_btc;
          set["metrics.priceChange.day.btc"] = sNow.price_btc - sDayAgo.price_btc;
        }

        if (sMonthAgo && sMonthAgo.price_btc) {
          set["metrics.priceChangePercents.month.btc"] = 100.0 *
            (sNow.price_btc - sMonthAgo.price_btc) / sNow.price_btc;
          set["metrics.priceChange.month.btc"] = sNow.price_btc - sMonthAgo.price_btc;
        }

        // calculate cap from supply and store it;
        if (sNow.supply_current) {
          sNow.cap_usd = sNow.supply_current * sNow.price_usd;
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
      if (sDayAgo && sDayAgo.supply_current) {
        //  count cap using price and supply
        sDayAgo.cap_usd = sDayAgo.supply_current * (sDayAgo.price_usd || sNow.price_usd);

        //  count cap using price and suuply
        sDayAgo.cap_btc = sDayAgo.supply_current * (sDayAgo.price_btc || sNow.price_usd);
      }

      if (sMonthAgo && sMonthAgo.supply_current) {
        sMonthAgo.cap_usd = sMonthAgo.supply_current * (sMonthAgo.price_usd || sNow.price_usd);
        sMonthAgo.cap_btc = sMonthAgo.supply_current * (sMonthAgo.price_btc || sNow.price_usd);
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
        if (sDayAgo && sDayAgo.supply_current) {
          set["metrics.supplyChangePercents.day"] = 100.0 *
            (sNow.supply_current - sDayAgo.supply_current) / sNow.supply_current;

          set["metrics.supplyChange.day"] = sNow.supply_current - sDayAgo.supply_current;
        }

        if (sMonthAgo && sMonthAgo.supply_current) {
          set["metrics.supplyChangePercents.month"] = 100.0 *
            (sNow.supply_current - sMonthAgo.supply_current) / sNow.supply_current;

          set["metrics.supplyChange.month"] = sNow.supply_current - sMonthAgo.supply_current;
        }
      }


      if (sNow.cap_usd) {
        set["metrics.cap.usd"] = sNow.cap_usd;
      }
      if (sNow.cap_btc) {
        set["metrics.cap.btc"] = sNow.cap_btc;
      }

      if (sNow.volume24_btc) {
        set["metrics.tradeVolume"] = sNow.volume24_btc;
        capBtc = sNow.cap_btc || (curDoc && curDoc.metrics && curDoc.metrics.cap && curDoc.metrics.cap.btc);
        if (capBtc && sNow.volume24_btc) {
          set["metrics.turnover"] = (0.0 + sNow.volume24_btc) / capBtc;
        } else {
          set["metrics.turnover"] = 0.0;
        }

        if (sDayAgo && sDayAgo.volume24_btc) {
          set["metrics.tradeVolumePrevious.day"] = sDayAgo.volume24_btc;
        }

        if (sMonthAgo && sMonthAgo.volume24_btc) {
          set["metrics.tradeVolumePrevious.month"] = sMonthAgo.volume24_btc;
        }

      }

      if (sNow.cap_usd && sDayAgo && sDayAgo.cap_usd) {
        set["metrics.capChangePercents.day.usd"] = 100.0 *
          (sNow.cap_usd - sDayAgo.cap_usd) / sNow.cap_usd;
        set["metrics.capChange.day.usd"] = sNow.cap_usd - sDayAgo.cap_usd;
      }

      if (sNow.cap_btc && sDayAgo && sDayAgo.cap_btc) {
        set["metrics.capChangePercents.day.btc"] = 100.0 *
          (sNow.cap_btc - sDayAgo.cap_btc) / sNow.cap_btc;
        set["metrics.capChange.day.btc"] = sNow.cap_btc - sDayAgo.cap_btc;
      }



      if (sNow.cap_usd && sMonthAgo && sMonthAgo.cap_usd) {
        set["metrics.capChangePercents.month.usd"] = 100.0 *
          (sNow.cap_usd - sMonthAgo.cap_usd) / sNow.cap_usd;
        set["metrics.capChange.month.usd"] = sNow.cap_usd - sMonthAgo.cap_usd;
      }

      if (sNow.cap_btc && sMonthAgo && sMonthAgo.cap_btc) {
        set["metrics.capChangePercents.month.btc"] = 100.0 *
          (sNow.cap_btc - sMonthAgo.cap_btc) / sNow.cap_btc;
        set["metrics.capChange.month.btc"] = sNow.cap_btc - sMonthAgo.cap_btc;
      }



      // those are used to build daily charts
      if (!_.isEmpty(set) && curDoc) {
        set.updatedAt = new Date();
        //
        if (curDoc && curDoc.flags && curDoc.flags.supply_from_here) {
          set["metrics.supply"] = curDoc.specs.supply;
          set["metrics.cap.btc"] = curDoc.specs.supply * set["metrics.price.btc"];
          set["metrics.cap.usd"] = curDoc.specs.supply * set["metrics.price.usd"];
        }

        var fastMetric = _.pick(sNow, [
          "cap_usd", "cap_btc", "volume24_btc", "price_usd", "volume24_usd", "price_btc"
        ]);
        fastMetric.timestamp = timestamp;

        set["lastData"] = fastMetric;

        CurrentData.update(_searchSelector(bucket.key), {
          $set: set
        });

        fastMetric.systemId = curDoc._id;
        fastMetric.stamp = stamp;
        FastData.insert(fastMetric);
      }

    };

    handleArrayWithInterval(todayBuckets, process.env.ELASTIC_INTERVAL_DELAY || 0, handleBucket, function(items){
      if (notFounds.length) {
        logger.warn("not found any currentData for ");
        logger.warn(notFounds);
      }
    });
  },

  averages_l15: function(result) {
    if (!result || !result.aggregations || !result.aggregations.by_system || !result.aggregations.by_system.buckets) {
      return;
    }
    var buckets = result.aggregations.by_system.buckets; //todo: resolve this crap using smth built into queries.

    handleBucket = function handleBucket(bucket) {
      var findSel = _searchSelector(bucket.key),
        set = {};

      if (!_.isEmpty(set)) {
        try {
          CurrentData.update(_searchSelector(bucket.key), {
            $set: set
          });
        } catch (e) {
          console.log("could not update currentData: ");
          console.log(e);
          console.log(_searchSelector(bucket.key));
          console.log(set);
        }
      } else {
        // logger.info("no averages for " + bucket.key);
      }
    };
    handleArrayWithInterval(buckets, process.env.ELASTIC_INTERVAL_DELAY || 0, handleBucket, function(items){});
  },

  averages_date_hist: function(result, params) {
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
    console.log("length of buckets (averages_date_hist): ", buckets.length);
    handleBucket = function handleBucket(sysBucket) {
      var systemKey = sysBucket.key;
      var id = CurrentData.findOne(_searchSelector(systemKey));
      if (!id) {
        notFounds.push(sysBucket.key);
        return;
      }
      id = id._id;
      //if (daily) _key = "dailyData";
      //if (hourly) _key = "hourlyData";
      if (!sysBucket.over_time || !sysBucket.over_time.buckets ||
         !_.isArray(sysBucket.over_time.buckets)) {
        return;
      }

      // apply changes to currentData
      // var sexchangeData

      function grab(timeBucket) {
        var ret = {};
        _.each(["cap_usd", "cap_btc", "volume24_btc",
          "price_usd", "volume24_usd", "price_btc"
        ], function(k) {
          ret[k] = timeBucket[k].value;
        });
        return ret;
      }

      _.each(sysBucket.over_time.buckets, function(timeBucket) {

        if (!timeBucket.key) return;
        if (typeof timeBucket.key === "string") timeBucket.key = parseInt(timeBucket.key);
        if (isNaN (timeBucket.key) || timeBucket.key < epoch) return;

        var timestamp = new Date(timeBucket.key);
        if (!timestamp) return;

        //var key;
        var doc = grab(timeBucket);
        if (!_.isEmpty(doc)) {
          var interval =  daily ? "daily" : hourly ? "hourly" : "unknown";
          _.extend(doc, {
            interval: interval,
            timestamp: timestamp,
            systemId: id,
            source: "2015"
          });
          try { // for some reason, there s unique index over. indexing of market data is a separate task
            MarketData.insert(doc);
          } catch (e) {
            console.log("MarketData dupl: Int: %s, System: %s, UTC: %s", interval, id, utc.format("YYYY-MM-DD:HH-mm-ss"));
          }
        }
      });
    };
    handleArrayWithInterval(buckets, process.env.ELASTIC_INTERVAL_DELAY || 0, handleBucket, function(items){});
  }
};

function fetchLatest(params) {
  try {
    var p1 = {"from": "now-15m", "to": "now"};
    _.extend(p1, params);

    var d = moment();
    var today = extractFromPromise(cfEs.sendQuery ("latest_values", p1));
    var n = moment();
    console.log(" received response to query 'latest_values (current)' after "+ n.diff(d, "milliseconds")+" milliseconds" );

    var p2 = {"from": "now-1d-15m", "to": "now-1d"};
    _.extend(p2, params);
    d = moment();
    var yesterday = extractFromPromise(cfEs.sendQuery ("latest_values", p2));
    n = moment();
    console.log(" received response to query 'latest_values (yesterday)' after "+ n.diff(d, "milliseconds")+" milliseconds" );

    var p3 = {"from": "now-1M-15m", "to": "now-1M"};
    _.extend(p3, params);
    d = moment();

    var monthAgo = extractFromPromise(cfEs.sendQuery ("latest_values", p3));
    n = moment();
    console.log(" received response to query 'latest_values (monthAgo)' after "+ n.diff(d, "milliseconds")+" milliseconds" );

    esParsers.latest_values(today, yesterday, monthAgo);

  } catch (e) {
    logger.warn("could not fetch latest values");
    logger.warn(e);
    return e;
  }
}

function fetchAverage15m(params) {
  try {
    var d = moment();
    var result = extractFromPromise(cfEs.sendQuery("averages_last_15m", params));
    var n = moment();
    console.log(" received response to query 'averages_last_15m' after "+ n.diff(d, "milliseconds")+" milliseconds");
    esParsers.averages_l15(result);
  } catch (e) {
    logger.warn("could not fetch latest_!5m_averages");
    logger.warn(e);
    throw (e);
  }
}

function fetchAverages(params) {
  var d = moment();
  var result = extractFromPromise(cfEs.sendQuery("average_values_date_histogram", params));
  var n = moment();
  console.log(" received response to query 'average_values_date_histogram' after "+ n.diff(d, "milliseconds")+" milliseconds" );
  esParsers.averages_date_hist(result);
}

var hourlyAves = {
  name: "fetch last hour averages",
  schedule: function(parser) {
    return parser.cron("4 * * * *", false);
  },
  job: function() {
    var params = {
      from: "now-1h/h",
      to: "now/h",
      interval: "hour"
    };
    _.extend(params, {
      systems: gatherSymSys({})
    });
    console.log ("average hour");
    var result = extractFromPromise(cfEs.sendQuery("average_values_date_histogram", params));
    esParsers.averages_date_hist(result, params);
  }
};

SyncedCron.add(hourlyAves);

SyncedCron.add({
  name: "fetch last day averages",
  schedule: function(parser) {
    return parser.cron("6 0 * * *", false);
  },
  job: function() {
    var params = {
      from: "now-1d/d",
      to: "now/d",
      interval: "day"
    };
    var result = extractFromPromise(cfEs.sendQuery("average_values_date_histogram", params));
    esParsers.averages_date_hist(result, params);
  }
});

Meteor.startup(function(){
  return false;
  var params = {
    from: "now-1d/d",
    to: "now/d",
    interval: "day"
  };
  var result = extractFromPromise(cfEs.sendQuery("average_values_date_histogram", params));
  esParsers.averages_date_hist(result, params);

  params = {
    from: "now-2d/d",
    to: "now-1d/d",
    interval: "day"
  };
  result = extractFromPromise(cfEs.sendQuery("average_values_date_histogram", params));
  esParsers.averages_date_hist(result, params);

  params = {
    from: "now-3d/d",
    to: "now-2d/d",
    interval: "day"
  };
  result = extractFromPromise(cfEs.sendQuery("average_values_date_histogram", params));
  esParsers.averages_date_hist(result, params);

  params = {
    from: "now-4d/d",
    to: "now-3d/d",
    interval: "day"
  };
  result = extractFromPromise(cfEs.sendQuery("average_values_date_histogram", params));
  esParsers.averages_date_hist(result, params);

});

Meteor.methods({
  "initAverageValues": function(curDataId) {
    var curDataDoc = CurrentData.findOne({
      _id: curDataId
    });
    if (!curDataDoc || curDataDoc.initializedAverages || !curDataDoc.token) return; //only shoot once. like a real panda.

    var system = curDataDoc.token.symbol + "|" + curDataDoc.system;
    // fetch dailies for 30 last days
    var params = {
      from: "now-4y/d",
      to: "now/d",
      interval: "day",
      system: system
    };
    try {
      var result = extractFromPromise(cfEs.sendQuery("average_values_date_histogram", params));
      esParsers.averages_date_hist(result, params);

      // fetch hourlies for past week;
      params = {
        from: "now-30d/h",
        to: "now/h",
        interval: "hour",
        system: system
      };
      try {
        result = extractFromPromise(cfEs.sendQuery("average_values_date_histogram", params));
        esParsers.averages_date_hist(result, params);

        CurrentData.update({
          _id: curDataId
        }, {
          $set: {
            initializedAverages: true
          }
        });
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
  name: "fetch latest elasticsearch data",
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.cron("3/5 * * * *", false);
  },
  job: function() {
    try {
      var s = gatherSymSys({});
      fetchAverage15m({
        systems: s
      });
    } catch (e) {
      console.log("could not fetch elastic data (15m averages)");
    }
  }
});


SyncedCron.add({
  name: "fetch avegares 15m elasticsearch data",
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.cron("20 0/5 * * * *", true);
  },
  job: function() {
    try {
      var s = gatherSymSys({});
      fetchLatest({
        systems: s
      });
    } catch (e) {
      console.log("could not fetch elastic data (latest)");
    }
  }
});


var saveTotalCap = function() {
  var btcMetrics = CurrentData.findOne({
    _id: "Bitcoin"
  }, {
    fields: {
      "metrics": 1
    }
  });
  btcMetrics = btcMetrics && btcMetrics.metrics;
  if (!btcMetrics) return;

  var btcPrice = btcMetrics.price && btcMetrics.price.usd;
  var btcPriceDayAgo = btcPrice - (btcMetrics.priceChange && btcMetrics.priceChange.day &&
    btcMetrics.priceChange.day.usd || 0);

  var calcTotalCap = function() {
    function isAutonomous(item) {
      return !item.dependencies || item.dependencies == "independent" || item.dependencies.indexOf("independent") >= 0;
    }
    var cap = 0;
    var capDayAgo = 0;
    var autonomous = 0;
    var dependent = 0;
    CurrentData.find({}, {
      "metrics.cap": 1,
      "dependencies": 1
    }).forEach(function(sys) {
      if (sys.metrics && sys.metrics.cap && sys.metrics.cap.btc) {
        cap += sys.metrics.cap.btc;
        if (isAutonomous(sys)) {
          autonomous++;
        } else {
          dependent++;
        }

        if (sys.metrics.capChange && sys.metrics.capChange.day && sys.metrics.capChange.day.btc ) {
          capDayAgo += sys.metrics.cap.btc - sys.metrics.capChange.day.btc;
        }
      }

    });
    return {
      btc: cap,
      btcDayAgo: capDayAgo,
      autonomous: autonomous,
      dependent: dependent
    };
  };

  var cap = calcTotalCap();
  if (cap) {
    Extras.upsert({
      _id: "total_cap"
    }, _.extend(cap, {
      usd: cap.btc * btcPrice,
      btc: cap.btc,
      usdDayAgo: cap.btcDayAgo * btcPriceDayAgo,
      btcDayAgo: cap.btcDayAgo
    }));
  }
};

Meteor.startup(function(){
  saveTotalCap();
});

SyncedCron.add({
  name: "total btc cap",
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.cron("* 1 * * *", false);
  },
  job: function() {
    try {
      saveTotalCap();
    } catch (e) {
      console.log("could not fetch elastic data (latest)");
    }
  }
});

function gatherSymSys(selector) {
  var ret = [];
  CurrentData.find(selector).forEach(function(item) {
    var s = symSys(item);
    if (s) ret.push(s);
  });
  return ret;
}

function symSys(system) {
  var sym = system.token && system.token.symbol || null;
  var sys = system._id;

  return sym ? [sym, sys].join("|") : null;
}
