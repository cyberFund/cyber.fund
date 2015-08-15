Template['fulltimeGraph'].rendered = function () {
  var ticks = [];
  var self = this;
  Tracker.autorun(function (comp) {
    if (!self.data || !self.data.dailyData) return;
    comp.stop();
    var current = moment.utc().startOf('day');
    //calc first data point
    var minyear = _.min(_.keys(self.data.dailyData));
    var minmonth = _.min(_.keys(self.data.dailyData[minyear]));
    var minday = _.min(_.keys(self.data.dailyData[minyear][minmonth]));
    var iterate = moment.utc([ minyear,  minmonth,  minday]);

    //do the rest
    while (iterate < current) {
      var year = iterate.year();
      var month = iterate.month();
      var day = iterate.date();
      var key = [year, month, day].join(".");
      var val = self.data.dailyData[year] ? self.data.dailyData[year][month] ?
        self.data.dailyData[year][month][day] : null : null;
      var tick = {
        key: key,
        value: val || null,
        needKey: iterate.date() == current.date() //only will display those days
      };
      ticks.push(tick);
      iterate = iterate.add(1, "days");
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
      var format = (dta[1] == 11) ? "D[&nbsp;]MMM YYYY" : "D[&nbsp;]MMM";
      var dte = moment({
        year: dta[0],
        month: dta[1],
        day: dta[2]
      }).format(format);

      dataCapBtc.labels.push(tick.needKey ? dte : "");
      dataCapBtc.series[0].push((tick && tick.value) ? tick.value["cap_btc"] || null : null);

      dataCapUsd.labels.push(tick.needKey ? dte : "");
      dataCapUsd.series[0].push((tick && tick.value) ? tick.value["cap_usd"] || null : null);

      dataVol.labels.push(tick.needKey ? dte : "");
      dataVol.series[0].push((tick && tick.value) ? tick.value["volume24_btc"] || null : null);
    });

    if (self.data.metrics) {
      if (self.data.metrics.cap) {
        dataCapBtc.labels.push(current.format("D[&nbsp;]MMM"));
        dataCapBtc.series[0].push(self.data.metrics.cap.btc || null);

        dataCapUsd.labels.push(current.format("D[&nbsp;]MMM"));
        dataCapUsd.series[0].push(self.data.metrics.cap.usd || null);
      }

      dataVol.labels.push(current.format("D[&nbsp;]MMM"));
      dataVol.series[0].push(self.data.metrics.tradeVolume || null);
    }
    // Create a new line chart object where as first parameter we pass in a selector
    // that is resolving to our chart container element. The Second parameter
    // is the actual data object.
    self.$(".ct-chart-monthly-cap-btc").css("height", "240px");
    new Chartist.Line('.ct-chart-monthly-cap-btc', dataCapBtc, {
      showPoint: false,
      chartPadding: {
        top: 20,
        right: 30,
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
            axisTitle: ''
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
      showPoint: false,
      chartPadding: {
        top: 20,
        right: 30,
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
        right: 30,
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
            axisTitle: ''
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

      if (dataVol.series[0][i] == null) dataVol.series[0][i] = 0;
    }
  });
};

Template['fulltimeGraph'].helpers({
  'foo': function () {
    
  }
});

Template['fulltimeGraph'].events({
  'click .bar': function (e, t) {
    
  }
});