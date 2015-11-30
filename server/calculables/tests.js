CF.CurrentData.calculatables.addCalculatable('numOfStarred', function(system) {
  var n = system._usersStarred ? system._usersStarred.length : 0;
  return n;
})

Meteor.startup(function() {
  CF.CurrentData.calculatables.triggerCalc('numOfStarred');
  CF.CurrentData.calculatables.triggerCalc('firstDatePrice');
})

CF.CurrentData.calculatables.addCalculatable('firstDatePrice', function(system) {
  if (!system) return;

  var data = system.dailyData;
  if (!data) return;

  var minFunc = function(it) {
    return parseInt(it);
  };
  var minyear = _.min(_.keys(data), minFunc);
  if (!minyear) return;

  var minmonth = _.min(_.keys(data[minyear]), minFunc);
  if (minmonth != 0 && !minmonth) return;

  var minday = _.min(_.keys(data[minyear][minmonth]), minFunc);
  if (minday != 0 && !minday) return;

  var firstData = data[minyear] ? data[minyear][minmonth] ? data[minyear][minmonth][minday] : null : null

  return {
    market: firstData,
    date: moment.utc({
      year: minyear,
      month: minmonth,
      day: minday
    })
  };
})
