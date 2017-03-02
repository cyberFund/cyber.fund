import cfMarketData from '/imports/api/client/cf/marketData'

var cfChartist = {
  labelOffset: {
    x: 0,
    y: -20
  },
  dateformats: {
    daily: "HH:mm",
    weekly: "MMM[&nbsp;]D HH[:00]",
    monthly: "D MMM",
    fulltime: "D[&nbsp;]MMM",
    fulltimeLong: "D[&nbsp;]MMM YYYY"
  },
  heights: {
    trade: "140px",
    cap: "240px"
  }
};

_.extend(cfChartist, {
  fn: {
    tickData: function (tick, key) {
      return (tick && tick.value) ? tick.value[key] || null : null;
    },
    tickString: function (tick, key) {
      return (tick && tick.value) ? tick.value[key] || "" : "";
    },
    dataStencil: function () {
      return {labels: [], capB: [], capU: [], trade: []}
    },
    pushTick: function (tick, data, dte, format) {
      data.labels.push(tick.needKey ? dte.format(format) : "");
      if (_.contains([cfChartist.dateformats.weekly, cfChartist.dateformats.daily], format)) {
        format += "[ UTC]";
      }
      data.capB.push(
        {
          value: cfChartist.fn.tickData(tick, "cap_btc"),
          meta: [cfChartist.fn.tickString(tick, "price_btc"), dte.format(format).replace("&nbsp;", " ")].join('|')
        });

      data.capU.push(
        {
          value: cfChartist.fn.tickData(tick, "cap_usd"),
          meta: [cfChartist.fn.tickString(tick, "price_usd"), dte.format(format).replace("&nbsp;", " ")].join("|")
        });

      data.trade.push(
        {
          value: cfChartist.fn.tickData(tick, "volume24_btc"),
          meta: [cfChartist.fn.tickString(tick, "price_btc"), dte.format(format).replace("&nbsp;", " ")].join("|")
        });
    },
    daily: {}, weekly: {}, monthly: {}, fulltime: {},
    interpolate: function (datasetsArray) {
      _.each(datasetsArray, function (dta) {
        for (var i = 0; i < dta.length; i++) {
          if (dta[i] == null || dta[i].value == null) {
            var point = i;
            var j = point;
            // # find max element
            while (j < dta.length && (dta[j] == null || dta[j].value == null)) j++;
            i = j;
            if (!(j >= dta.length)) {
              var max = j, maxval = dta[j].value;

              // # find closest value on left
              j = point;
              while (j >= 0 && (dta[j] == null || dta[j].value == null))j--;
              if (!(j < 0)) {


                var min = j, minval = dta[j].value, step = (maxval - minval) / (max - min);
                j = point;

                for (j = min + 1; j < max; j++) {
                  dta[j].value = minval + (j - min) * step;
                  dta[j].meta = 'interpolated ' + dta[j].meta;
                }
              }
            }
          }
        }
      });
    }
  },
  options: {
    axisX: {},
    axisY: {},
    chartPadding: {
      cap: {
        top: 20,
        right: 30,
        bottom: 30,
        left: 35
      },
      trade: {
        top: 0,
        right: 30,
        bottom: 0,
        left: 35
      },
      folio: {
        top: 40,
        right: 40,
        bottom: 40,
        left: 40
      }
    },
    plugins: {
      tooltip: {
        cap: {
          usd: {
            labelOffset: cfChartist.labelOffset,
            tooltipFnc: cfMarketData.tooltipFncS
          },
          btc: {
            labelOffset: cfChartist.labelOffset,
            tooltipFnc: cfMarketData.tooltipFncB
          }
        },
        trade: {
          labelOffset: cfChartist.labelOffset,
          tooltipFnc: cfMarketData.tooltipFncT
        }
      },
      ctAxisTitle: {
        cap: {
          btc: {
            axisX: {},
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
          },
          usd: {
            axisX: {},
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
          }
        },
        trade: {
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
        }
      }
    }
  }
});


_.extend(cfChartist.fn.daily, {
  getData: function (ticks) {
    var data = cfChartist.fn.dataStencil();
    _.each(ticks, function (tick) {

      var dta = tick.key.split(".");
      var format = cfChartist.dateformats.daily;
      var dte = moment.utc({
        day: dta[0],
        hour: dta[1],
        minute: dta[2]
      });
      cfChartist.fn.pushTick(tick, data, dte, format);
    });
    return data
  }
});

_.extend(cfChartist.fn.weekly, {
  getData: function (ticks) {
    var data = cfChartist.fn.dataStencil();
    _.each(ticks, function (tick) {

      var dta = tick.key.split(".");
      var format = cfChartist.dateformats.weekly;
      var dte = moment.utc({
        year: dta[0],
        month: dta[1],
        day: dta[2],
        hour: dta[3]
      });

      cfChartist.fn.pushTick(tick, data, dte, format);
    });
    return data
  }
});

_.extend(cfChartist.fn.monthly, {
  getData: function (ticks) {
    var data = cfChartist.fn.dataStencil();
    _.each(ticks, function (tick) {

      var dta = tick.key.split(".");
      var format = cfChartist.dateformats.monthly;
      var dte = moment.utc({
        year: dta[0],
        month: dta[1],
        day: dta[2]
      });
      cfChartist.fn.pushTick(tick, data, dte, format);
    });
    return data
  }
});

_.extend(cfChartist.fn.fulltime, {
  getData: function (ticks) {
    var data = cfChartist.fn.dataStencil();
    _.each(ticks, function (tick) {
      var dta = tick.key.split(".");
      var format = (dta[1] == 11) ? cfChartist.dateformats.fulltimeLong : cfChartist.dateformats.fulltime;
      var dte = moment.utc({
        year: dta[0],
        month: dta[1],
        day: dta[2]
      });
      cfChartist.fn.pushTick(tick, data, dte, format);
    });
    return data
  }
});

module.exports = cfChartist
