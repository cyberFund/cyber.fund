var ns = CF.Chartist;
console.log(ns);
Template['weeklyGraph'].rendered = function () {
  var ticks = [];
  var self = this;
  Tracker.autorun(function (comp) {
    if (!self.data || !self.data.hourlyData) return;
    comp.stop();
    var current = moment.utc();
    for (var i = 7*24; i > 0; i=i-3) {
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
        needKey: iterate.hours() == current.hours()//only will display those days
      };
      ticks.push(tick);
    }
    var data = CF.Chartist.fn.weekly.getData(ticks);
    if (self.data.metrics) {
      data.labels.push("");//current.format("D HH"));
      if (self.data.metrics.cap && self.data.metrics.price) {
        data.capB.push({meta: self.data.metrics.price.btc || '', value: self.data.metrics.cap.btc || null});
        data.capU.push(self.data.metrics.cap.usd || null);
      }
      data.trade.push(self.data.metrics.tradeVolume || null);
    }

    for (i = 0; i< data.trade.length; i++){ //pathcing bug in chartist
      if (data.trade[i] == null) data.trade[i] = 0;
    }
    // Create a new line chart object where as first parameter we pass in a selector
    // that is resolving to our chart container element. The Second parameter
    // is the actual data object.
    self.$(".ct-chart-cap-btc").css("height", ns.heights.cap);
    new Chartist.Line('.ct-chart-cap-btc', {labels: data.labels, series: [data.capB]}, {
      chartPadding: ns.options.chartPadding.cap,
      axisY: ns.options.axisY,
      plugins: [
        Chartist.plugins.tooltip(ns.options.plugins.tooltip.cap.btc),
        Chartist.plugins.ctAxisTitle( ns.options.plugins.ctAxisTitle.cap.btc)
      ]
    });

    self.$(".ct-chart-cap-usd").css("height", ns.heights.cap);
    new Chartist.Line('.ct-chart-cap-usd',  {labels: data.labels, series: [data.capU]}, {
      chartPadding: ns.options.chartPadding.cap,
      axisY: {
        labelInterpolationFnc: function (value) {
          return CF.Utils.monetaryFormatter(value);
        }
      },
      plugins: [
        Chartist.plugins.tooltip(ns.options.plugins.tooltip.cap.usd),
        Chartist.plugins.ctAxisTitle(ns.options.plugins.ctAxisTitle.cap.usd)
      ]
    });

    self.$(".ct-chart-vol").css("height", ns.heights.trade);
    new Chartist.Bar('.ct-chart-vol',  {labels: data.labels, series: [data.trade]}, {
      chartPadding: ns.options.chartPadding.trade,
      axisY: ns.options.axisY,
      plugins: [
        Chartist.plugins.tooltip(ns.options.plugins.tooltip.trade),
        Chartist.plugins.ctAxisTitle(ns.options.plugins.ctAxisTitle.trade)
      ]
    });
  });
};
