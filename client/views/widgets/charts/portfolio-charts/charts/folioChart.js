var cfCDs = CF.CurrentData .selectors;

CF.UserAssets.graph = CF.UserAssets.graph || {};
CF.UserAssets.graph.minimalShare = 0.015;

Template['folioChart'].onRendered(function () {
  var self = this;

  self.autorun(function (comp) {
    var dddd = Template.currentData()
    var accounts = dddd && dddd.accountsData;

    //var accounts = Template.instance().data && Template.instance().data.accountsData;
    if (!accounts || !_.keys(accounts).length) return;

    var ticks = [], labels = [];

    var options = _Session.get("portfolioOptions") || {},

      systems = CF.UserAssets.getSystemsFromAccountsObject(accounts);
    var r = CurrentData.find(cfCDs.system(systems));

    var data = r.fetch().sort(function(x, y){
      var q1 = CF.UserAssets.getQuantitiesFromAccountsObject(accounts, x._id),
        q2 = CF.UserAssets.getQuantitiesFromAccountsObject(accounts, y._id);
      return Math.sign(q2 * CF.CurrentData.getPrice(y) - q1 * CF.CurrentData.getPrice(x)) || Math.sign(q2 - q1);
    });
    console.log(data);

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
        symbol: system._id,
        q: CF.UserAssets.getQuantitiesFromAccountsObject(accounts, system._id)
      };
      point.u = (system.metrics && system.metrics.price && system.metrics.price.usd) ? point.q * system.metrics.price.usd : 0;
      point.b = (system.metrics && system.metrics.price && system.metrics.price.btc) ? point.q * system.metrics.price.btc : 0;

      datum.push(point);
      sum += point.b;
    });

    if (!sum) return;
    _.each(datum, function (point) {
      if (point.b / sum >= CF.UserAssets.graph.minimalShare) {
        labels.push(point.symbol);
        ticks.push({
          value: point.u,
          meta: 'N: ' + point.q.toFixed(4) + '; BTC: ' + point.b.toFixed(4) + '; USD: ' + point.u.toFixed(2)
        })
      } else {
        others.u += point.u;
        others.b += point.b;
      }
    });

    if (others.b && others.b > 0) {
      labels.push("OTHER");
      ticks.push({
        value: others.u,
        meta: 'other assets: BTC: ' + others.b.toFixed(4) + '; USD: ' + others.u.toFixed(2)
      })
    }

    if (ticks.length && self.$('.ct-chart.folio-pie').length )
    CF.UserAssets.graph.folioPie = // crutch
    new Chartist.Pie('.ct-chart.folio-pie', {
      labels: labels,
      series: ticks
    }, {
      chartPadding: CF.Chartist.options.chartPadding.folio,
      startAngle: 0,
      labelOffset: 82,
      labelDirection: 'explode'
    });
  })
});

Template['folioChart'].helpers({
  dd: function () {
    return Template.instance().data.accountsData
  }
});
