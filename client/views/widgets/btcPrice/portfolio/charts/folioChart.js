var sortFunction = function (x, y) {
  if (!x.token || !x.token.token_symbol) return 1;
  if (!y.token || !y.token.token_symbol) return -1;

  var p1 =
    CF.UserAssets.getQuantitiesFromAccountsObject(
      CF.UserAssets.getAccountsObject(), x.token.token_symbol) * x.metrics.price.btc
  var p2 =
    CF.UserAssets.getQuantitiesFromAccountsObject(
      CF.UserAssets.getAccountsObject(), y.token.token_symbol) * y.metrics.price.btc
  return Math.sign(p2 > p1);
}

Template['folioChart'].rendered = function () {

  var self = this;
  Tracker.autorun(function (comp) {
    var ticks = [], labels = []

    var options = Session.get("portfolioOptions") || {},
      user = Meteor.user(),
      symbols = CF.UserAssets.getSymbolsFromAccountsObject(CF.UserAssets.getAccountsObject());
    var r = CurrentData.find(CF.CurrentData.selectors.symbol(symbols));
    var data = r.fetch().sort(sortFunction);

    console.log(data);
    _.each(data, function (system) {
      var q = CF.UserAssets.getQuantitiesFromAccountsObject(CF.UserAssets.getAccountsObject(), system.token.token_symbol);
      var b = q * system.metrics.price.btc;
      var u = q * system.metrics.price.usd;
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