cfRating = {}; //params of ratings page
cfRating.limit0 = 50; //how many coins to display at start of rating page
cfRating.limit1 = 180; //how many coins to display at start of tracking page
cfRating.step = 100; //how many coins to add on "discover more" btn click

// todo move to triggers
var sorters = {
  "metrics.supplyChangePercents.day": {
    "inflation": -1,
    "deflation": 1
  },
  "metrics.turnover": {
    "active": -1,
    "passive": 1
  },
  "calculatable.RATING.vector.GR.monthlyGrowthD": {
    "profit": -1,
    "loss": 1
  },
  "calculatable.RATING.vector.GR.months": {
    "mature": -1,
    "young": 1
  },
  "metrics.cap.usd": {
    "whales": -1,
    "dolphins": 1
  },
  "metrics.capChangePercents.day.usd": {
    "bulls": -1,
    "bears": 1
  },
  "calculatable.RATING.vector.LV.num": {
    "love": -1,
    "hate": 1
  },
  "calculatable.RATING.sum": {
    "leaders": -1,
    "suckers": 1
  }
};

cfRating.getSorterByKey = function (key){
  var ret = {};
  _.each(sorters, function(sorter, sorterKey){
    _.each(sorter, function(v, k){
      if (k == key) ret[sorterKey] = v;
    });
  });
  return ret;
};

cfRating.getKeyBySorter =  function( sorterobj = {} ){
  var ret = null;
  var key = _.keys(sorterobj).length && _.keys(sorterobj)[0];
  if (!key) return ret;
  var value = sorterobj[key];
  var obj = sorters[key];
  if (!obj) return ret;
  _.each(obj, function(v, k){
    if (v == value) ret = k;
  });
  return ret;
};

module.exports = cfRating
