var ns = CF.Chartist;
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
        needKey: iterate.weeks()%4==0 //only will display those days
      };
      ticks.push(tick);
      iterate = iterate.add(7, "days");
    }
    var data = ns.fn.fulltime.getData(ticks);

    if (self.data.metrics && self.data.metrics.cap && self.data.metrics.price) {
      var dta = current.format(ns.dateformats.fulltime).replace("&nbsp;", " ");
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

    ns.fn.interpolate([data.capB, data.capU]);

    /*if (self.data.metrics) {
      data.labels.push("");//current.format("D HH"));
      if (self.data.metrics.cap  && self.data.metrics.price) {
        data.capB.push({meta: self.data.metrics.price.btc || '', value: self.data.metrics.cap.btc || null});
        data.capU.push(self.data.metrics.cap.usd || null);
      }
      data.trade.push(self.data.metrics.tradeVolume || null);
    }*/


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

Template['fulltimeGraph'].helpers({
  'foo': function () {

  }
});

Template['fulltimeGraph'].events({
  'click .bar': function (e, t) {

  }
});
