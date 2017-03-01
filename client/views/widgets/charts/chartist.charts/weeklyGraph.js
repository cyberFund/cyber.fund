var CF.Chartist = CF.Chartist;
Template['weeklyGraph'].rendered = function () {
  var ticks = [];
  var self = this;
  Tracker.autorun(function (comp) {
    if (!self.data || !self.data.hourlyData) return;
    //comp.stop();
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

    if (self.data.metrics && self.data.metrics.cap && self.data.metrics.price) {
      var dta = current.format(CF.Chartist.dateformats.weekly).replace("&nbsp;", " ");
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


    for (i = 0; i< data.trade.length; i++){ //pathcing bug in chartist
      if (data.trade[i] == null) data.trade[i] = 0;
    }

    CF.Chartist.fn.interpolate([data.capB, data.capU]);

    // Create a new line chart object where as first parameter we pass in a selector
    // that is resolving to our chart container element. The Second parameter
    // is the actual data object.
    self.$(".ct-chart-cap-btc").css("height", CF.Chartist.heights.cap);
    new Chartist.Line('.ct-chart-cap-btc', {labels: data.labels, series: [data.capB]}, {
      chartPadding: CF.Chartist.options.chartPadding.cap,
      axisY: CF.Chartist.options.axisY,
      plugins: [
        Chartist.plugins.tooltip(CF.Chartist.options.plugins.tooltip.cap.btc),
        Chartist.plugins.ctAxisTitle( CF.Chartist.options.plugins.ctAxisTitle.cap.btc)
      ]
    });

    self.$(".ct-chart-cap-usd").css("height", CF.Chartist.heights.cap);
    new Chartist.Line('.ct-chart-cap-usd',  {labels: data.labels, series: [data.capU]}, {
      chartPadding: CF.Chartist.options.chartPadding.cap,
      axisY: {
        labelInterpolationFnc: function (value) {
          return CF.Utils.monetaryFormatter(value);
        }
      },
      plugins: [
        Chartist.plugins.tooltip(CF.Chartist.options.plugins.tooltip.cap.usd),
        Chartist.plugins.ctAxisTitle(CF.Chartist.options.plugins.ctAxisTitle.cap.usd)
      ]
    });

    self.$(".ct-chart-vol").css("height", CF.Chartist.heights.trade);
    new Chartist.Bar('.ct-chart-vol',  {labels: data.labels, series: [data.trade]}, {
      chartPadding: CF.Chartist.options.chartPadding.trade,
      axisY: CF.Chartist.options.axisY,
      plugins: [
        Chartist.plugins.tooltip(CF.Chartist.options.plugins.tooltip.trade),
        Chartist.plugins.ctAxisTitle(CF.Chartist.options.plugins.ctAxisTitle.trade)
      ]
    });
  });
};
