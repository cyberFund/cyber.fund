var ns = CF.Chartist;
Template['dailyGraph'].rendered = function () {

  var self = this;
  Tracker.autorun(function (comp) {
    var ticks = [];
    if (!self.data || !self.data.graphData) return;
    var current = moment.utc().startOf("minute");

    current.subtract(current.minutes()%10, "minutes");

    var iterate = moment.utc(current).subtract(1, 'days');
    while (iterate < current) {
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
        needKey: s.minute == current.minutes()
      };
      ticks.push(tick);
      iterate = iterate.add(10, "minutes");
    }
    var data = ns.fn.daily.getData(ticks);

    if (self.data.metrics) {
      data.labels.push("");//current.format("D HH"));
      if (self.data.metrics.cap  && self.data.metrics.price) {
        data.capB.push({meta: self.data.metrics.price.btc || '', value: self.data.metrics.cap.btc || null});
        data.capU.push(self.data.metrics.cap.usd || null);
      }
      data.trade.push(self.data.metrics.tradeVolume || null);
    }
    for (i = 0; i< data.trade.length; i++){ //pathcing bug in chartist
      if (data.trade[i] == null) data.trade[i] = 0;
    }

    console.log(ticks);
    console.log(data);

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

Template['dailyGraph'].helpers({
  'foo': function () {
    
  }
});

Template['dailyGraph'].events({
  'click .bar': function (e, t) {
    
  }
});