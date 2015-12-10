// convolution of 2 objects, for provided keys only
// expects _keys_ to be an array, and v1, v2 objects.
// can also drill deeper into objects if subkN s provided
function _getValue(v, k, subk){
  if (!v) return 0;
  var i = v[k];
  if (!i) return 0;
  if (subk) return i[subk] || 0;
  return i || 0;
}

function convolution(keys, v1, v2, subk1, subk2) {
  var sum = _.reduce(_.map(keys, function(key) {
      var m1 = _getValue(v1, key, subk1);
      var m2 = _getValue(v2, key, subk2);
      return m1 * m2;
    }),
    function(memo, num) {
      return memo + num;
    }, 0);
  return sum;
}

function multiplication(keys, v1, v2, subk1, subk2) {
  var ret = {}
  _.each(keys, function(key) {
    var m1 = _getValue(v1, key, subk1);
    var m2 = _getValue(v2, key, subk2);
    ret[key] = m1 * m2;
  })
  return ret;
}


function _getStage(system) {
  // to reload this - db.CurrentData.distinct("descriptions.state");
  var stages = ["Dead", "Pre-Public", 'Private', "Project", "Public", "Running", "live"];
  var stage = system.descriptions && system.descriptions.state;
  if (!stage || !_.contains(stages, stage)) return undefined;
  return stage;
}

function _geTType(system) {
  var types = ['cryptocurrentcy', 'cryptoasset'];
  var t = system.descriptions && system.descriptions.system_type;
//  if (system.system == 'Bitcoin')
//    console.log(t)
//  if (!t || !_.contains(types, t)) return undefined;
  return t;
}

var weightsRATING = {
  'Project': {
    CS: 1,
    LV: 4,
    WL: 0,
    BR: 0,
    AM: 0
  },
  'Pre-Public': {
    CS: 1,
    LV: 2.5,
    WL: 0.5,
    BR: 0.5,
    AM: 0.5
  },
  'Private': {
    CS: 1,
    LV: 3,
    WL: 0,
    BR: 0.5,
    AM: 0.5
  },
  'Public': {
    CS: 1,
    LV: 2,
    WL: 1,
    BR: 0.5,
    AM: 0.5
  },
  'Dead': {

  },
  'live': {

  }
}

var weightsCS = {
  "cryptocurrency": {
    "Public": {
      site: .05,
      community: .05,
      updates: .05,
      code: .05,
      science: .05,
      knowledge: .05,
      buy: .3,
      hold: .1,
      analyze: .1,
      earn: .1
    },
    "Pre-Public": {
      site: .15,
      community: .15,
      updates: .20,
      code: .20,
      science: .15,
      knowledge: .15
    },
    "Project": {
      site: .15,
      community: .15,
      updates: .20,
      code: .20,
      science: .15,
      knowledge: .15
    },
    "Dead": {
      site: .15,
      community: .15,
      updates: .20,
      code: .20,
      science: .15,
      knowledge: .15
    },
    "live": {
      site: .15,
      community: .15,
      updates: .20,
      code: .20,
      science: .15,
      knowledge: .15
    },
    "Running": {
      site: .15,
      community: .15,
      updates: .20,
      code: .20,
      science: .15,
      knowledge: .15
    },
  },
  "cryptoasset": {
    "Public": {
      site: .05,
      community: .05,
      updates: .10,
      code: .20,
      science: .05,
      knowledge: .05,
      buy: .4,
      hold: .05,
      analyze: .05,
      earn: 0
    },
    "Pre-Public": {
      site: .15,
      community: .15,
      updates: .20,
      code: .20,
      science: .15,
      knowledge: .15
    },
    "Project": {
      site: .15,
      community: .15,
      updates: .20,
      code: .20,
      science: .15,
      knowledge: .15
    },
    "Dead": {
      site: .15,
      community: .15,
      updates: .20,
      code: .20,
      science: .15,
      knowledge: .15
    },
    "live": {
      site: .15,
      community: .15,
      updates: .20,
      code: .20,
      science: .15,
      knowledge: .15
    },
    "Running": {
      site: .15,
      community: .15,
      updates: .20,
      code: .20,
      science: .15,
      knowledge: .15
    },
  }
}

Meteor.startup(function() {
  CF.CurrentData.calculatables.triggerCalc('firstDatePrice');
  CF.CurrentData.calculatables.triggerCalc('nLinksWithTag');
  //CF.CurrentData.calculatables.triggerCalc('CS');
  //CF.CurrentData.calculatables.triggerCalc('AM');
  //CF.CurrentData.calculatables.triggerCalc('BR');
  //CF.CurrentData.calculatables.triggerCalc('LV');
  //CF.CurrentData.calculatables.triggerCalc('WL');
  //CF.CurrentData.calculatables.triggerCalc('GR');
  CF.CurrentData.calculatables.triggerCalc('RATING');
});


CF.CurrentData.calculatables.addCalculatable('RATING', function(system) {
  var stage = _getStage(system);
  var t = _geTType(system);

  var keys = ['CS', 'LV', 'WL', 'BR', 'AM', 'GR']

  var weights = weightsRATING[stage],
    vector = {
      CS: calcCS(system),
      LV: calcLV(system),
      WL: calcWL(system),
      BR: calcBR(system),
      AM: calcAM(system),
      GR: calcGR(system)
    };

  var weigths = weightsRATING[stage] || {},
    weighted = multiplication(keys, vector, weights, 'sum');

  var sum = _.reduce(_.map(keys, function(key) {
      return (weighted[key]);
    }),
    function(memo, num) {
      return memo + num;
    }, 0);


  return {
    vector: vector,
    weights: weights,
    weighted: weighted,
    sum: sum,
    tip: t,
    stage: stage
  }
});

CF.CurrentData.calculatables.addCalculatable('firstDatePrice', function(system) {
  if (!system) return undefined;

  var data = system.dailyData;
  if (!data) return undefined;

  var minFunc = function(it) {
    return parseInt(it);
  };
  var minyear = _.min(_.keys(data), minFunc);
  if (!minyear) return undefined;

  var minmonth = _.min(_.keys(data[minyear]), minFunc);
  if (minmonth != 0 && !minmonth) return undefined;

  var minday = _.min(_.keys(data[minyear][minmonth]), minFunc);
  if (minday != 0 && !minday) return undefined;

  var firstData = data[minyear] ? data[minyear][minmonth] ? data[minyear][minmonth][minday] : null : null

  return {
    market: firstData,
    date: moment.utc({
      year: minyear,
      month: minmonth,
      day: minday
    })._d
  };
})

function calcGR(system) {
  if (!system) return undefined;
  var nm = CF.CurrentData.calculatables.fieldName;

  var fp = system.first_price,
    fpb = fp ? fp.btc : null,
    fpd = fp ? fp.usd : null,
    fd = fp && fp.date ? new Date(fp.date) : null;

  function getMonths() {
    if (!system) return undefined;
    if (!fd) {
      fd = system[nm] && system[nm].firstDatePrice && system[nm].firstDatePrice.date;
    }
    return moment().diff(moment(fd), 'months', true)
  }

  var timeDiff = getMonths()

  function getMonthlyGrowth() {
    var currentPriceB = system.metrics ? system.metrics.price ? system.metrics.price.btc : null : null;
    var currentPriceD = system.metrics ? system.metrics.price ? system.metrics.price.usd : null : null;
    var ret = {}

    if (!fpb || !fpd) {
      var firstPrice = system[nm] && system[nm].firstDatePrice && system[nm].firstDatePrice.market;
      if (firstPrice) {
        if (!fpd) fpd = firstPrice.price_usd;
        if (!fpb) fpb = firstPrice.price_btc;
      }
    }

    if (timeDiff) {
      if (currentPriceD && fpd) ret['d'] = 100 *
        (Math.pow(currentPriceD / fpd, 1 / timeDiff) - 1);
      if (currentPriceB && fpb) ret['b'] = 100 *
        (Math.pow(currentPriceB / fpb, 1 / timeDiff) - 1);
    }
    return ret;
  }

  var mg = getMonthlyGrowth();

  return {
    months: timeDiff,
    monthlyGrowthB: mg.b,
    monthlyGrowthD: mg.d,
    sum: 0.1
  }
};

function calcWL(system) {
  // weighted liquidity
  var ret = {
    sum: 0,
    cap: 0,
    trade: 0
  }
  if (!system.metrics || !system.metrics.cap) return ret;
  var cap = system.metrics.cap.usd;

  var volumeDaily = system.metrics.tradeVolume;
  var absolute = system.metrics.cap.btc

  function getTradeScore(absolute, volumeDaily) {
    if (!absolute) {
      return 0;
    }
    var r = Math.abs(volumeDaily / absolute);
    if (r == 0) return 0;
    if (r < 0.0001) return 0.1;
    if (r < 0.001) return 0.2;
    if (r < 0.005) return 0.3;
    if (r < 0.02) return 0.4;
    return 0.5;
    return 0;
  }

  function getCapScore(c) {
    if (!c) return 0;
    var k = 1000,
      M = 1000000
    if (c < 10 * k) return 0;
    if (c < 100 * k) return 0.1;
    if (c < 1 * M) return 0.2;
    if (c < 10 * M) return 0.3;
    if (c < k * M) return 0.4;
    return 0.5;
  }

  ts = getTradeScore(absolute, volumeDaily);
  cs = getCapScore(cap);
  ret = {
    sum: cs + ts,
    cap: cs,
    trade: ts
  }
  return ret;
};

function calcLV(system) {
  var sel = {
    _id: 'maxLove'
  };

  function getMax() {
    var n = 0,
      system = '';
    CurrentData.find({}, {
        fields: {
          _usersStarred: 1,
          system: 1
        }
      })
      .forEach(function(item) {
        if (item._usersStarred && item._usersStarred.length > n) {
          n = item._usersStarred.length;
          system = item.system;
        }
      });
    Extras.upsert(sel, {
      system: system,
      value: n
    });
  }

  var n = system._usersStarred ? system._usersStarred.length : 0;
  var maxLove = Extras.findOne(sel);
  if (!maxLove) {
    maxLove = {
      _id: 'maxLove',
      value: n,
      system: system.system
    };
    Extras.insert(maxLove);
  }
  if (maxLove.value < n) {
    Extras.update(sel, {
      system: system.system,
      value: n
    });
  }
  if (maxLove.system == system.system && n < maxLove.value) {
    getMax()
  }
  return {
    num: n,
    sum: (n / maxLove.value) || 0
  }
}


function calcAM(system) {

  var flag = _.contains(_.values(CF.UserAssets.qMatchingTable), system.system);
  return {
    flag: flag,
    sum: flag ? 1 : 0
  }
}

function calcBR(system) {
  function getFlag() {
    if (!system.metrics || !system.metrics.supply) {
      return false;
    }

    if (!system.specs || !system.specs.supply) return true;
    if (system.specs.supply != system.metrics.supply) return true;
    return false;
  }

  var flag = getFlag()
  return {
    flag: flag,
    sum: flag ? 1 : 0
  }
};

function calcCS(system) {
  var stage = _getStage(system);
  var t = _geTType(system);
  // convert from links to 1/0
  var wt = system.calculatable.nLinksWithTag;
  if (!wt) {
    console.log("CS calculation: no links calculated for " + system.system);
    return undefined;
  }

  var flags = {
    site: wt['Main'] ? 1 : 0,
    community: wt['Community'] ? 1 : 0,
    updates: wt['News'] ? 1 : 0,
    code: (wt['Code'] || wt['code']) ? 1 : 0,
    science: wt['Science'] ? 1 : 0,
    knowledge: (wt['Publictaions'] || wt['paper']) ? 1 : 0,
  }

  if (stage == "Public") {
    _.extend(flags, {
      buy: wt['Exchange'] ? 1 : 0,
      hold: (wt['Wallet'] || wt['wallet']) ? 1 : 0,
      analyze: (wt['Analytics'] || wt['Exporer']) ? 1 : 0,
      earn: true ? 1 : 0
    });
  }

  var basic = "stub";
  var extended = "stub"; // see https://docs.google.com/spreadsheets/d/1YkrIitYD6FS2a4IEmBlfwAuCMgMwIKgU5JMHQzsfg-k/edit#gid=755429566&vpid=A1

  var keys = ['site', 'community', 'updates', 'code', 'science', 'knowledge'];

  var v = {};

  if (t && stage) {
    v = weightsCS[t] || {};
    v = v[stage] || {}
  }
  var sum = convolution(keys, v, flags);

  //if (sum == undefined) return undefined;

  return {
    details: flags,
    sum: sum,
    weights: v,
    tip: t,
    stage:stage
  }
};


CF.CurrentData.calculatables.addCalculatable('nLinksWithTag', function(system) {
  if (!system) return undefined;
  var tags = ['Apps', 'Code', 'Main', 'publications', 'News',
    'Science', 'Analytics', 'Exchange', 'Wallet', 'Publications',
    'Explorer', 'code', 'DAO', 'App', 'API', 'paper', 'wallet', 'Community'
  ];
  links = system.links,
    ret = {};
  if (!links || !links.length) return undefined;
  _.each(tags, function(tag) {
    ret[tag] = CF.CurrentData.linksWithTag(links, tag).length;
  });
  return ret;
})
