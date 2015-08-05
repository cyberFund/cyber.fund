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

    var dataCapBtc = {
      labels: [],
      series: [
        []
      ]
    };
    var dataCapUsd = {
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

      dataCapBtc.labels.push(tick.sameDOW ? dte : "");
      dataCapBtc.series[0].push((tick && tick.value) ? tick.value["cap_btc"] || null : null);

      dataCapUsd.labels.push(tick.sameDOW ? dte : "");
      dataCapUsd.series[0].push((tick && tick.value) ? tick.value["cap_usd"] || null : null);

      dataVol.labels.push(tick.sameDOW ? dte : "");
      dataVol.series[0].push((tick && tick.value) ? tick.value["volume24_btc"] || null : null);
    });

    if (self.data.metrics) {
      if (self.data.metrics.cap) {
        dataCapBtc.labels.push(current.format("D MMM"));
        dataCapBtc.series[0].push(self.data.metrics.cap.btc || null);

        dataCapUsd.labels.push(current.format("D MMM"));
        dataCapUsd.series[0].push(self.data.metrics.cap.usd || null);
      }

      dataVol.labels.push(current.format("D MMM"));
      dataVol.series[0].push(self.data.metrics.tradeVolume || null);
    }
    // Create a new line chart object where as first parameter we pass in a selector
    // that is resolving to our chart container element. The Second parameter
    // is the actual data object.
    self.$(".ct-chart-monthly-cap-btc").css("height", "240px");
    new Chartist.Line('.ct-chart-monthly-cap-btc', dataCapBtc, {
      chartPadding: {
        top: 20,
        right: 0,
        bottom: 30,
        left: 35
      },
      axisY: {
        labelInterpolationFnc: function (value) {
          return CF.Utils.monetaryFormatter(value);
        }
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

    self.$(".ct-chart-monthly-cap-usd").css("height", "240px");
    new Chartist.Line('.ct-chart-monthly-cap-usd', dataCapUsd, {
      chartPadding: {
        top: 20,
        right: 0,
        bottom: 30,
        left: 35
      },
      axisY: {
        labelInterpolationFnc: function (value) {
          return CF.Utils.monetaryFormatter(value);
        }
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
            axisTitle: 'Cap Usd',
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

    self.$(".ct-chart-monthly-vol").css("height", "140px");
    new Chartist.Bar('.ct-chart-monthly-vol', dataVol, {
      chartPadding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 35
      },
      axisY: {
        labelInterpolationFnc: function (value) {
          return CF.Utils.monetaryFormatter(value);
        }
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
    for (i = 0; i< dataVol.series[0].length; i++){

      if (dataVol.series[0][i] == null) {
        dataVol.series[0][i] = 0;
      }
    }
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