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
        self.data.dailyData[year][month][day] : null : null;
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
    _.each(ticks, function (tick) {
      var dta = tick.key.split(".");
      var dte = moment({
        year: dta[0],
        month: dta[1],
        day: dta[2]
      }).format("D MMM");

      dataCap.labels.push(tick.sameDOW ? dte : "");
      dataCap.series[0].push((tick && tick.value) ? tick.value["cap_btc"] || null : null);

      dataVol.labels.push(tick.sameDOW ? dte : "");
      dataVol.series[0].push((tick && tick.value) ? tick.value["volume24_btc"] || null : null);
    });

    if (self.data.metrics) {
      if (self.data.metrics.cap) {
        dataCap.labels.push(current.format("D MMM"));
        dataCap.series[0].push(self.data.metrics.cap.btc || null);
      }

      dataVol.labels.push(current.format("D MMM"));
      dataVol.series[0].push(self.data.metrics.tradeVolume || null);
    }

    // Create a new line chart object where as first parameter we pass in a selector
    // that is resolving to our chart container element. The Second parameter
    // is the actual data object.
    console.log(dataCap);
    console.log(dataVol);
    new Chartist.Line('.ct-chart-monthly-cap', dataCap, {
      chartPadding: {
        top: 20,
        right: 0,
        bottom: 30,
        left: 35
      },
      plugins: [
        Chartist.plugins.tooltip({
            transform: function (v) {
              return "Ƀ " + CF.Utils.readableN(v, 2);
            },
            labelOffset: {
              x: 0,
              y: -20
            }
          }
        ),
        Chartist.plugins.ctAxisTitle({
          axisX: {
            axisTitle: 'Date',
            axisClass: 'ct-axis-title',
            offset: {
              x: 10,
              y: 40
            },
            textAnchor: 'middle'
          },
          axisY: {
            axisTitle: 'Cap Btc',
            axisClass: 'ct-axis-title',
            offset: {
              x: 0,
              y: -4
            },
            textAnchor: 'middle',
            flipTitle: false
          }
        })
      ]
    });
    new Chartist.Bar('.ct-chart-monthly-vol', dataVol, {
      chartPadding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 35
      },
      plugins: [
        Chartist.plugins.tooltip({
          transform: function (v) {
            return "Ƀ " + CF.Utils.readableN(v, 2);
          },
          labelOffset: {
            x: 0,
            y: -20
          }
        }),
        Chartist.plugins.ctAxisTitle({
          axisX: {
            axisTitle: '',
            axisClass: 'ct-axis-title',
            offset: {
              x: 0,
              y: 50
            },
            textAnchor: 'middle'
          },
          axisY: {
            axisTitle: 'Trade Btc',
            axisClass: 'ct-axis-title',
            offset: {
              x: 0,
              y: -4
            },
            textAnchor: 'middle',
            flipTitle: false
          }
        })
      ]
    });
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