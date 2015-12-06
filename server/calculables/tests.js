CF.CurrentData.calculatables.addCalculatable('numOfStarred', function(system) {
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
  return n;
});


Meteor.startup(function() {
  CF.CurrentData.calculatables.triggerCalc('numOfStarred');
  //CF.CurrentData.calculatables.triggerCalc('firstDatePrice');
  CF.CurrentData.calculatables.triggerCalc('monthlyGrowth');
  CF.CurrentData.calculatables.triggerCalc('months');
  CF.CurrentData.calculatables.triggerCalc('nLinksWithTag');
  CF.CurrentData.calculatables.triggerCalc('CS');
})

CF.CurrentData.calculatables.addCalculatable('CS', function(system) {
  // to reload this - db.CurrentData.distinct("descriptions.state");
  var stages = [ "Dead", "Pre-Public", "Project", "Public", "Running", "live"];
  var stage = system.descriptions && system.descriptions.state;
  if (!stage || !_.contains(stages, stage)) return undefined;

  var types = ['cryptocurrentcy', 'cryptoasset'];
  var type = system.descriptions && system.descriptions.system_type;
  if (!stage || !_.contains(stages, stage)) return undefined;

  // convert from links to 1/0
  var wt = system.calculatable.nLinksWithTag;
  if (!wt) {
    console.log ("CS calculation: no links calculated for "+system.system);
    return undefined;
  }

  var mandatory = {
    site: wt['Main'] ? 1 : 0,
    community: wt['Community'] ? 1 : 0,
    updates: wt['News'] ? 1 : 0,
    code: (wt['Code'] || wt['code']) ? 1 : 0,
    science: wt['Science'] ? 1 : 0,
    knowledge: (wt['Publictaions'] || wt['paper']) ? 1 : 0,
  }

  if (stage == "Public") {
    _.extend(mandatory, {
      buy: wt['Exchange'] ? 1: 0,
      hold: (wt['Wallet'] || wt['wallet'] ) ? 1: 0,
      analyze: (wt['Analytics'] || wt['Exporer']) ? 1: 0,
      earn: true ? 1: 0
    });
  }

  var basic = "stub";
  var extended = "stub"; // see https://docs.google.com/spreadsheets/d/1YkrIitYD6FS2a4IEmBlfwAuCMgMwIKgU5JMHQzsfg-k/edit#gid=755429566&vpid=A1

  var keys = ['site', 'community', 'updates', 'code', 'science', 'knowledge'];

  weights = {
    "cryptocurrency": {
      "Public": {
        site: .05, community: .05, updates: .05,  code: .05,  science: .05, knowledge: .05,
        buy: .3, hold: .1, analyze: .1,  earn: .1
      },
      "Pre-Public": {
        site: .15, community: .15, updates: .20,  code: .20,  science: .15, knowledge: .15
      },
      "Project": {
        site: .15, community: .15, updates: .20,  code: .20,  science: .15, knowledge: .15
      },
      "Dead": {
        site: .15, community: .15, updates: .20,  code: .20,  science: .15, knowledge: .15
      },
      "live": {
        site: .15, community: .15, updates: .20,  code: .20,  science: .15, knowledge: .15
      },
      "Running": {
        site: .15, community: .15, updates: .20,  code: .20,  science: .15, knowledge: .15
      },
    },
    "cryptoasset": {
      "Public": {
        site: .05, community: .05, updates: .10,  code: .20,  science: .05, knowledge: .05,
        buy: .4, hold: .05, analyze: .05,  earn: 0
      },
      "Pre-Public": {
        site: .15, community: .15, updates: .20,  code: .20,  science: .15, knowledge: .15
      },
      "Project": {
        site: .15, community: .15, updates: .20,  code: .20,  science: .15, knowledge: .15
      },
      "Dead": {
        site: .15, community: .15, updates: .20,  code: .20,  science: .15, knowledge: .15
      },
      "live": {
        site: .15, community: .15, updates: .20,  code: .20,  science: .15, knowledge: .15
      },
      "Running": {
        site: .15, community: .15, updates: .20,  code: .20,  science: .15, knowledge: .15
      },
    }
  }

  // weight 1/0 (exits/not)
  function mandatoryScore(type, stage, mandatory, weights){

    // convolution of 2 objects, for provided keys only
    // expects _keys_ to be an array, and v1, v2 objects.
    function convolution(keys, v1, v2) {
      var sum = _.reduce(_.map(keys, function(key){
        return (v1[key] || 0) * (v2[key] || 0);
      }),
        function(memo, num){ return memo + num; }, 0);
      return sum;
    }


    var v = weights[type];
    if (!v) return undefined;
    v = v[stage];
    if (!v) return undefined;

    return convolution(keys, v, mandatory);
  };

  return mandatoryScore(type, stage, mandatory, weights);
});


CF.CurrentData.calculatables.addCalculatable('nLinksWithTag', function(system) {
  if (!system) return undefined;
  var tags = [ 'Apps', 'Code',  'Main',  'publications',  'News',
  'Science',  'Analytics',  'Exchange',  'Wallet',  'Publications',
  'Explorer',  'code',  'DAO',  'App',  'API',  'paper',  'wallet', 'Community' ];
    links = system.links,
    ret = {};
  if (!links || !links.length) return undefined;
  _.each(tags, function(tag) {
    ret[tag] = CF.CurrentData.linksWithTag(links, tag).length;
  });
  return ret;
})

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


CF.CurrentData.calculatables.addCalculatable('months', function(system) {
  if (!system) return undefined;
  var nm = CF.CurrentData.calculatables.fieldName;

  var firstPrice = system[nm].firstDatePrice;
  var firstDate;
  if (firstPrice) {
    firstDate = firstPrice.date;
    firstPrice = firstPrice.market;
  } else {
    return undefined;
  }

  return moment().diff(moment(firstDate), 'months', true)
})

CF.CurrentData.calculatables.addCalculatable('monthlyGrowth', function(system) {
  if (!system) return undefined;
  var nm = CF.CurrentData.calculatables.fieldName;

  var firstPrice = system[nm].firstDatePrice;
  var firstDate;
  if (firstPrice) {
    firstDate = firstPrice.date;
    firstPrice = firstPrice.market;
  } else {
    return undefined;
  }

  if (firstPrice && firstPrice.price_usd) {
    firstPrice = firstPrice.price_usd;
  } else {
    return undefined;
  }

  var currentPrice = system.metrics ? system.metrics.price ? system.metrics.price.usd : null : null;
  var timeDiff = moment().diff(moment(firstDate), 'months', true)

  if (firstPrice && currentPrice && timeDiff) {
    return 100 * (Math.pow(currentPrice / firstPrice, 1 / timeDiff) - 1);
  } else {
    return undefined
  }
})
