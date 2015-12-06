
CF.CurrentData.calculatables.addCalculatable('numOfStarred', function(system) {
  var sel = {_id: 'maxLove'};

  function getMax(){
    var n = 0, system = '';
    CurrentData.find({}, {fields: {_usersStarred: 1, system: 1}})
    .forEach(function (item){
      if (item._usersStarred && item._usersStarred.length > n) {
        n = item._usersStarred.length;
        system = item.system;
      }
    });
    Extras.upsert(sel, {system: system, value: n});
  }

  var n = system._usersStarred ? system._usersStarred.length : 0;
  var maxLove = Extras.findOne(sel);
  if (!maxLove) {
    maxLove = {_id: 'maxLove', value: n, system: system.system};
    Extras.insert(maxLove);
  }
  if (maxLove.value < n) {
    Extras.update(sel, {system: system.system, value: n});
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
  CF.CurrentData.calculatables.triggerCalc('linksWithTag');
})


CF.CurrentData.calculatables.addCalculatable('linksWithTag', function(system) {
  if (!system) return undefined;
})

CF.CurrentData.calculatables.addCalculatable('firstDatePrice', function(system) {
  if (!system) return undefined;

  var data = system.dailyData;
  if (!data) return  undefined;

  var minFunc = function(it) {
    return parseInt(it);
  };
  var minyear = _.min(_.keys(data), minFunc);
  if (!minyear) return  undefined;

  var minmonth = _.min(_.keys(data[minyear]), minFunc);
  if (minmonth != 0 && !minmonth) return  undefined;

  var minday = _.min(_.keys(data[minyear][minmonth]), minFunc);
  if (minday != 0 && !minday) return  undefined;

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

  var currentPrice = system.metrics ? system.metrics.price ? system.metrics.price.usd
  : null : null;
  var timeDiff = moment().diff(moment(firstDate), 'months', true)

  if (firstPrice && currentPrice && timeDiff) {
    return 100*(Math.pow(currentPrice/firstPrice, 1/timeDiff)-1);
  }
  else {
    return undefined
  }
})
