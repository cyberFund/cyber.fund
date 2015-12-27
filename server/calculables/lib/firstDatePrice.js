
CF.CurrentData.calculatables.addCalculatable('firstDatePrice', function(system) {
  if (!system) return undefined;

  //Migration 2: instead, take 1st point at MarketData.
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
  //Migration 2.
  return {
    market: firstData,
    date: moment.utc({
      year: minyear,
      month: minmonth,
      day: minday
    })._d
  };
})
