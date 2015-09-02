Template['folioChart'].rendered = function () {

  var self = this;
  Tracker.autorun(function (comp) {
    var ticks = [], labels = []

    var options = Session.get("portfolioOptions") || {},
      user = Meteor.user(),
      symbols = CF.UserAssets.getSymbolsFromAccountsObject(CF.UserAssets.getAccountsObject());
    var r = CurrentData.find(CF.CurrentData.selectors.symbol(symbols));
    var data = r.fetch().sort(CF.UserAssets.folioSortFunction);

    _.each(data, function (system) {
      var q = CF.UserAssets.getQuantitiesFromAccountsObject(CF.UserAssets.getAccountsObject(), system.token.token_symbol);
      var b = (system.metrics && system.metrics.price && system.metrics.price.btc) ? q * system.metrics.price.btc : 0;
      var u = (system.metrics && system.metrics.price && system.metrics.price.usd) ? q * system.metrics.price.usd : 0;
      labels.push (system.token.token_symbol)
      ticks.push({
        value: u,
        meta: 'N: ' + q.toFixed(4) + '; BTC: ' + b.toFixed(4) + '; USD: ' + u.toFixed(2)
      })
    });

    new Chartist.Pie('.ct-chart.folio-pie', {
      labels: labels,
      series: ticks
    }, {
      donut: true,
      donutWidth: 90,
      startAngle: 15,
      //total: 200,
      //showLabel: true,
      plugins: [
        Chartist.plugins.tooltip()
      ]
    });
    //}
    //comp.stop()
  })
};

Template['folioChart'].helpers({
  'foo': function () {

  }
});

Template['folioChart'].events({
  'click .bar': function (e, t) {

  }
});