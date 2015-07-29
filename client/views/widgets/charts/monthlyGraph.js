Template['monthlyGraph'].rendered = function () {
  var ticks = [];
  var self = this;
  Tracker.autorun(function (comp) {
    if (!self.data || !self.data.dailyData) return;
    comp.stop();
    var current = moment.utc();
    for (var i = 30; i > 0; i--) {
      var iterate = moment.utc().subtract(i, "days");
      var year = iterate.year();
      var month = iterate.month();
      var day = iterate.date();
      var key = [year, month, day].join(".");
      var val = self.data.dailyData[year] ? self.data.dailyData[year][month] ?
        self.data.dailyData[year][month][day] : null : null ;
      var tick = {
        key: key,
        value: val || null,
        sameDOW: iterate.day() == current.day() //only will display those days
      };
      ticks.push(tick);
    }
    console.log(ticks);
    var dataCap = {
      labels: [],
      series: [
        []
      ]
    };
    var dataVol = {
      labels: [],
      series: [
        []
      ]
    };
    _.each(ticks, function(tick){
      var dta = tick.key.split(".");
      var dte = moment({year: dta[0], month: dta[1], day: dta[2]}).format("D MMM");

      dataCap.labels.push( tick.sameDOW ? dte : "");
      dataVol.labels.push( tick.sameDOW ? dte : "");

      dataCap.series[0].push((tick && tick.value) ? tick.value["cap_btc"] || null : null);
      dataVol.series[0].push((tick && tick.value) ? tick.value["volume24_btc"] || null : null);
    });

    // Create a new line chart object where as first parameter we pass in a selector
    // that is resolving to our chart container element. The Second parameter
    // is the actual data object.
console.log(dataCap);
console.log(dataVol);
    new Chartist.Line('.ct-chart-monthly-cap', dataCap);
    new Chartist.Bar('.ct-chart-monthly-vol', dataVol);
  });
};

Template['monthlyGraph'].helpers({
  'foo': function () {
    
  }
});

Template['monthlyGraph'].events({
  'click .bar': function (e, t) {
    
  }
});