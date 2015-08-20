Template['weeklyGraph'].rendered = function () {
  var ticks = [];
  var self = this;
  Tracker.autorun(function (comp) {
    if (!self.data || !self.data.hourlyData) return;
    comp.stop();
    var current = moment.utc();
    for (var i = 7*24; i > 0; i--) {
      var iterate = moment.utc().subtract(i, "hours");
      var year = iterate.year();
      var month = iterate.month();
      var day = iterate.date();
      var hour = iterate.hours();
      var key = [year, month, day, hour].join("."); //todo - so, going to build some lib specifically for chartist?
      var val = self.data.hourlyData[year] ? self.data.dailyData[year][month] ?
        self.data.hourlyData[year][month][day] ? self.data.hourlyData[year][month][day][hour] : null : null : null;
      var tick = {
        key: key,
        value: val || null,
        needKey: iterate.hours() == (current.hours()+23)%24 //only will display those days
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
        day: dta[2],
        hour: dta[3]
      }).format("MMM[&nbsp;]D HH[:00]");

      dataCapBtc.labels.push(tick.needKey ? dte : "");
      dataCapBtc.series[0].push({value: (tick && tick.value) ? tick.value["cap_btc"] || null : null,
      meta: (tick && tick.value) ? tick.value["price_btc"] || null : null });

      dataCapUsd.labels.push(tick.needKey ? dte : "");
      dataCapUsd.series[0].push((tick && tick.value) ? tick.value["cap_usd"] || null : null);

      dataVol.labels.push(tick.needKey ? dte : "");
      dataVol.series[0].push((tick && tick.value) ? tick.value["volume24_btc"] || null : null);
    });

    if (self.data.metrics) {
      if (self.data.metrics.cap) {
        dataCapBtc.labels.push("");//current.format("D HH"));
        dataCapBtc.series[0].push({meta: self.data.metrics.price.btc || null, value: self.data.metrics.cap.btc || null});

        dataCapUsd.labels.push("");//current.format("D HH"));
        dataCapUsd.series[0].push(self.data.metrics.cap.usd || null);
      }

      dataVol.labels.push("");//current.format("D HH"));
      dataVol.series[0].push(self.data.metrics.tradeVolume || null);
    }
    // Create a new line chart object where as first parameter we pass in a selector
    // that is resolving to our chart container element. The Second parameter
    // is the actual data object.
    self.$(".ct-chart-cap-btc").css("height", "240px");
    new Chartist.Line('.ct-chart-cap-btc', dataCapBtc, {
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
            tooltipFnc: CF.MarketData.tooltipFncB,
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

    self.$(".ct-chart-cap-usd").css("height", "240px");
    new Chartist.Line('.ct-chart-cap-usd', dataCapUsd, {
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
            tooltipFnc: CF.MarketData.tooltipFncS,
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

    self.$(".ct-chart-vol").css("height", "140px");
    new Chartist.Bar('.ct-chart-vol', dataVol, {
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
          tooltipFnc: CF.MarketData.tooltipFncB,
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

Template['weeklyGraph'].helpers({
  'foo': function () {
    
  }
});

Template['weeklyGraph'].events({
  'click .bar': function (e, t) {
    
  }
});