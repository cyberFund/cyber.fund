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
      var current = _.find(bucket.by_time.buckets, function (item) {
        return item.to == mx;
      });

      // day ago
      index = _.without(index, mx);
      mx = _.max(index);
      var dayAgo = _.find(bucket.by_time.buckets, function (item) {
        return item.to == mx;
      });

      var set = {},
        sNow = {}, sDayAgo = {}, sWeekAgo = {};

      if (_.isArray(current.latest.hits.hits) && current.latest.hits.hits.length > 0) {
        sNow = current.latest.hits.hits[0]._source;
      } else {
        //   logger.info("no current data for " + bucket.key);
        //   console.log(bucket);
        //   console.log();
      }

      if (_.isArray(dayAgo.latest.hits.hits) && dayAgo.latest.hits.hits.length > 0) {
        sDayAgo = dayAgo.latest.hits.hits[0]._source;
      } else {
        //                logger.info("no yesterday data for " + bucket.key);
        //              console.log();
      }

      if (_.isEmpty(sNow)) return;

      //todo: use same set of keys at CF.ES.queries.latest_Values
      if (sNow.supply_current) {


        set["metrics.supply"] = sNow.supply_current;
        if (sDayAgo.supply_current) {

          var supplyDayAgo = sDayAgo.supply_current// || sNow.supply_current;
          set["metrics.supplyChangePercents.day"] = 100.0 *
            (sNow.supply_current - supplyDayAgo) / sNow.supply_current;

          set["metrics.supplyChange.day"] = sNow.supply_current - supplyDayAgo;
        }

        // todo: add week changes/ month changes
        // if (sWeekAgo) {
        //
        // }
      }

      if (sNow.price_usd) {
        set["metrics.price.usd"] = sNow.price_usd;
        if (sDayAgo.price_usd) {
          set["metrics.priceChangePercents.day.usd"] = 100.0 *
            (sNow.price_usd - sDayAgo.price_usd) / sNow.price_usd;
          set["metrics.priceChange.day.usd"] = sNow.price_usd - sDayAgo.price_usd;
        }
      }

      if (sNow.price_btc) {
        set["metrics.price.btc"] = sNow.price_btc;
        if (sDayAgo.price_btc) {
          set["metrics.priceChangePercents.day.btc"] = 100.0 *
            (sNow.price_btc - sDayAgo.price_btc) / sNow.price_btc;
          set["metrics.priceChange.day.btc"] = sNow.price_btc - sDayAgo.price_btc;
        }
      }

      if (sNow.volume24_btc) {
        set["metrics.tradeVolume"] = sNow.volume24_btc;
        //set["metrics.tradeVolume.usd"] = sNow.volume24_usd;
        if (sDayAgo.volume24_btc) set["metrics.tradeVolumePrevious.day"] = sDayAgo.volume24_btc;
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

      if (CurrentData.find(_searchSelector(bucket.key)).count() == 0) {
        notFounds.push(bucket.key);
      }

      if (!_.isEmpty(set)) {
        set.updatedAt = new Date();
        // console.log(set);
        CurrentData.update(_searchSelector(bucket.key), {$set: set});
      }

    });
    if (notFounds.length) {
      logger.warn("not found any currentData for ");
      logger.warn(notFounds.length);

    }
    /*console.log(buckets[0]);
     console.log(buckets[0].by_time.buckets[0]);
     console.log(buckets[0].by_time.buckets[1]);
     console.log(buckets[0].by_time.buckets[0].latest.hits.hits);
     console.log(buckets[0].by_time.buckets[1].latest.hits.hits);*/
  },
  averages_l15: function (result) {
    if (!result || !result.aggregations || !result.aggregations.by_system || !result.aggregations.by_system.buckets) {
      return;
    }
    var buckets = result.aggregations.by_system.buckets; //todo: resolve this crap using smth built into queries.

    _.each(buckets, function (bucket) {
      var findSel = _searchSelector(bucket.key),
        set = {};

      if (bucket.avg_cap_usd.value) set["metrics.cap.usd"] = bucket.avg_cap_usd.value;
      if (bucket.avg_cap_btc.value) set["metrics.cap.btc"] = bucket.avg_cap_btc.value;
      if (!_.isEmpty(set)) {
        CurrentData.update(_searchSelector(bucket.key), {$set: set});
      } else {
        // logger.info("no averages for " + bucket.key);
      }
    });
  },
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
};

function fetchLatest(params) {
  try {
    var result = CF.Utils.extractFromPromise(CF.ES.sendQuery("latest_values", params));
    esParsers.latest_values(result)
  } catch(e){
    logger.warn("could not fetch latest values");
    logger.warn(e)
  }
}

function fetchAverage15m(params) {
  try {
    var result = CF.Utils.extractFromPromise(CF.ES.sendQuery("averages_last_15m", params));
    esParsers.averages_l15(result);
  } catch (e) {
    logger.warn("could not fetch latest_!5m_averages");
    logger.warn(e)
  }
}

function fetchAverages(params) {
  var result = CF.Utils.extractFromPromise(CF.ES.sendQuery("average_values_date_histogram", params));
  esParsers.averages_date_hist(result);
}

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

    var system = curDataDoc.token.token_symbol+"|"+curDataDoc.system;
    // fetch dailies for 30 last days
    var params = {
      from: "now-30d/d",
      to: "now/d",
      interval: "day",
      system: system
    };
    try {
      var result = CF.Utils.extractFromPromise(CF.ES.sendQuery("average_values_date_histogram", params));
      esParsers.averages_date_hist(result, params);

      // fetch hourlies for past week;
      params = {
        from: "now-7d/h",
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
    fetchAverage15m();
  }
});


SyncedCron.add({
  name: 'fetch avegares 15m elasticsearch data',
  schedule: function (parser) {
    // parser is a later.parse object
    return parser.cron('2/5 * * * *', false);
  },
  job: function () {
    fetchLatest();
  }
});

Meteor.methods({
  "print_currentData": function () {
    console.log(currentData);
  }
});