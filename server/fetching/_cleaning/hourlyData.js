var removeAllOldHourlyData = function () {
  var weekAgo = moment.utc().subtract(7, 'days');
  var year = weekAgo.year();
  var month = weekAgo.month();
  var day = weekAgo.date();

  function yearOk(key) {
    return parseInt(key) >= year;
  }

  function monthOk(key) {
    return parseInt(key) >= month;
  }

  function dayOk(key) {
    return parseInt(key) >= day;
  }

  function removeOldHourlyData(system) {
    var key = 'hourlyData';
    var unset = {};
    var dataAll = system[key];
    _.each(_.keys(dataAll), function (keyYear) {
      if (yearOk(keyYear)) {
        var dataYear = dataAll[keyYear];

        _.each(_.keys(dataYear), function (keyMonth) {
          if (monthOk(keyMonth)) {
            var dataMonth = dataYear[keyMonth];

            _.each(_.keys(dataMonth), function (keyDay) {
              if (!dayOk(keyDay)) {
                unset[[key, keyYear, keyMonth, keyDay].join('.')] = true;
              }
            });

          } else {
            unset[[key, keyYear, keyMonth].join('.')] = true;
          }
        });

      } else {
        unset[[key, keyYear].join('.')] = true;
      }
    });
    if (_.keys(unset).length) {
      CurrentData.update({_id: system._id}, {$unset: unset})
    }
  }

  CurrentData.find({hourlyData: {$exists: true}}).forEach(removeOldHourlyData);
};

SyncedCron.add({
  name: 'cut hourly data',
  schedule: function (parser) {
    // parser is a later.parse object
    return parser.text('at 2:10 am');
  },
  job: function () {
    removeAllOldHourlyData()
  }
});