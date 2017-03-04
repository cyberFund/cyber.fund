import cfChartist from '/imports/api/client/utils/chartist'
import {monetaryFormatter} from '/imports/api/client/utils/base'
Template['monthlyGraph'].onRendered( function () {
  var ticks = [];
  var self = this;
  Tracker.autorun(function (comp) {
    if (!self.data || !self.data.dailyData) return;
    //comp.stop();
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
        needKey: iterate.day() == current.day() //only will display those days
      };
      ticks.push(tick);
    }

    var data = cfChartist.fn.monthly.getData(ticks);

    if (self.data.metrics && self.data.metrics.cap && self.data.metrics.price) {
      var dta = current.format(cfChartist.dateformats.monthly).replace("&nbsp;", " ");
      data.labels.push("");//current.format("D HH"));

      data.capB.push(
        {
          meta: [self.data.metrics.price.btc || '', dta].join("|"),
          value: self.data.metrics.cap.btc || null
        });

      data.capU.push(
        {
          value: self.data.metrics.cap.usd || null,
          meta: [self.data.metrics.price.usd, dta].join("|")
        });

      data.trade.push(
        {
          value: self.data.metrics.tradeVolume || 0,
          meta: [self.data.metrics.price.btc, dta].join("|")
        });
    }
    /*
    if (self.data.metrics) {
      data.labels.push("");//current.format("D HH"));
      if (self.data.metrics.cap && self.data.metrics.price) {
        data.capB.push({meta: self.data.metrics.price.btc || '', value: self.data.metrics.cap.btc || null});
        data.capU.push(self.data.metrics.cap.usd || null);
      }
      data.trade.push(self.data.metrics.tradeVolume || null);
    }*/

    for (i = 0; i< data.trade.length; i++){ //pathcing bug in chartist
      if (data.trade[i] == null) data.trade[i] = 0;
    }

    cfChartist.fn.interpolate([data.capB, data.capU]);
    // Create a new line chart object where as first parameter we pass in a selector
    // that is resolving to our chart container element. The Second parameter
    // is the actual data object.
    self.$(".ct-chart-cap-btc").css("height", cfChartist.heights.cap);
    new Chartist.Line('.ct-chart-cap-btc', {labels: data.labels, series: [data.capB]}, {
      chartPadding: cfChartist.options.chartPadding.cap,
      axisY: cfChartist.options.axisY,
      plugins: [
        Chartist.plugins.tooltip(cfChartist.options.plugins.tooltip.cap.btc),
        Chartist.plugins.ctAxisTitle( cfChartist.options.plugins.ctAxisTitle.cap.btc)
      ]
    });

    self.$(".ct-chart-cap-usd").css("height", cfChartist.heights.cap);
    new Chartist.Line('.ct-chart-cap-usd',  {labels: data.labels, series: [data.capU]}, {
      chartPadding: cfChartist.options.chartPadding.cap,
      axisY: {
        labelInterpolationFnc: function (value) {
          return monetaryFormatter(value);
        }
      },
      plugins: [
        Chartist.plugins.tooltip(cfChartist.options.plugins.tooltip.cap.usd),
        Chartist.plugins.ctAxisTitle(cfChartist.options.plugins.ctAxisTitle.cap.usd)
      ]
    });

    self.$(".ct-chart-vol").css("height", cfChartist.heights.trade);
    new Chartist.Bar('.ct-chart-vol',  {labels: data.labels, series: [data.trade]}, {
      chartPadding: cfChartist.options.chartPadding.trade,
      axisY: cfChartist.options.axisY,
      plugins: [
        Chartist.plugins.tooltip(cfChartist.options.plugins.tooltip.trade),
        Chartist.plugins.ctAxisTitle(cfChartist.options.plugins.ctAxisTitle.trade)
      ]
    });
  });
});

Template['monthlyGraph'].helpers({
  'foo': function () {

  }
});

Template['monthlyGraph'].events({
  'click .bar': function (e, t) {

  }
});
