CF.UserAssets.graph = CF.UserAssets.graph || {};
CF.UserAssets.graph.minimalShare = 0.015;

Template['folioChart'].onCreated(function () {
  var self = this;
  Tracker.autorun(function (comp) {
    var ticks = [], labels = [];

    var options = Session.get("portfolioOptions") || {},
      user = Meteor.user(),
      systems = CF.UserAssets.getSystemsFromAccountsObject(self.data.chartData);
    var r = CurrentData.find(CF.CurrentData.selectors.system(systems));
    var data = r.fetch().sort(function(x, y){
      var q1 = CF.UserAssets.getQuantitiesFromAccountsObject(self.data.chartData, CF.CurrentData.getSystem(x)),
        q2 = CF.UserAssets.getQuantitiesFromAccountsObject(self.data.chartData, CF.CurrentData.getSystem(y));
      return Math.sign(q2 * CF.CurrentData.getPrice(y) - q1 * CF.CurrentData.getPrice(x)) || Math.sign(q2 - q1);
    });

    var sum = 0; // this to be used o determine if minor actives
    var datum = []; // let s calculate first and put calculations here
    var others = { // here be minor actives
      symbol: 'other',
      u: 0,
      b: 0,
      q: 0
    };
    _.each(data, function (system) {
      var point = {
        symbol: system.system,
        q: CF.UserAssets.getQuantitiesFromAccountsObject(self.data.chartData, system.system)
      };
      point.u = (system.metrics && system.metrics.price && system.metrics.price.usd) ? point.q * system.metrics.price.usd : 0;
      point.b = (system.metrics && system.metrics.price && system.metrics.price.btc) ? point.q * system.metrics.price.btc : 0;

      datum.push(point);
      sum += point.b;
    });

    if (!sum) return;
    _.each(datum, function (point) {
      if (point.b / sum >= CF.UserAssets.graph.minimalShare) {
        labels.push(point.symbol)
        ticks.push({
          value: point.u,
          meta: 'N: ' + point.q.toFixed(4) + '; BTC: ' + point.b.toFixed(4) + '; USD: ' + point.u.toFixed(2)
        })
      } else {
        others.u += point.u;
        others.b += point.b;
      }
    });

    if (others.b) {
      labels.push("OTHER");
      ticks.push({
        value: others.u,
        meta: 'other assets: BTC: ' + others.b.toFixed(4) + '; USD: ' + others.u.toFixed(2)
      })
    }

    new Chartist.Pie('.ct-chart.folio-pie', {
      labels: labels,
      series: ticks
    }, {
      chartPadding: CF.Chartist.options.chartPadding.folio,
      //donut: true,
      //donutWidth: 100,
      startAngle: 0,
      labelOffset: 82,
      labelDirection: 'explode'
    });
    //}
    //comp.stop()
  })
});

Template['folioChart'].helpers({
  'foo': function () {

  }
});

Template['folioChart'].events({
  'click .bar': function (e, t) {

  }
});
