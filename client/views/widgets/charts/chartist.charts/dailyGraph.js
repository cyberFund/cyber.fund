Template['dailyGraph'].rendered = function () {

  var self = this;
  Tracker.autorun(function (comp) {
    var ticks = [];
    if (!self.data || !self.data.graphData) return;
    var current = moment.utc().startOf("minute");

    current.subtract(current.minutes()%15, "minutes");

    var iterate = moment.utc(current).subtract(1, 'days');
    while (iterate <= current) {
      var s = {
        "stamp.day": iterate.date(),
        "stamp.hour": iterate.hours(),
        "stamp.minute": iterate.minutes(),
        systemId: self.data.currencyId
      }
      var item = FastData.findOne(s);
      var tick = {
        key: [s["stamp.day"], s["stamp.hour"], s["stamp.minute"]].join("."),
        value: item || null,
        needKey: s["stamp.minute"] == 0//current.minutes()
      };
      ticks.push(tick);
      iterate = iterate.add(15, "minutes");
    }

    var data = CF.Chartist.fn.daily.getData(ticks);

    if (self.data.metrics && self.data.metrics.cap && self.data.metrics.price) {
      var dta = current.format(CF.Chartist.dateformats.daily).replace("&nbsp;", " ");
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

Template['dailyGraph'].helpers({
  'foo': function () {

  }
});

Template['dailyGraph'].events({
  'click .bar': function (e, t) {

  }
});
