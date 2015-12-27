var ns = CF.CurrentData.calculatables;

ns.lib.calcs.calcGR = function calcGR(system) {
  if (!system) return undefined;
  var nm = CF.CurrentData.calculatables.fieldName;

  var fp = system.first_price,
    fpb = fp ? fp.btc : null,
    fpd = fp ? fp.usd : null,
    fd = fp && fp.date ? new Date(fp.date) : null;

  function getMonths() {
    if (!system) return undefined;
    if (!fd) {
      fd = system[nm] && system[nm].firstDatePrice && system[nm].firstDatePrice.date;
    }
    return moment().diff(moment(fd), 'months', true)
  }

  var timeDiff = getMonths()

  function getMonthlyGrowth() {
    var currentPriceB = system.metrics ? system.metrics.price ? system.metrics.price.btc : null : null;
    var currentPriceD = system.metrics ? system.metrics.price ? system.metrics.price.usd : null : null;
    var ret = {}

    if (!fpb || !fpd) {
      var firstPrice = system[nm] && system[nm].firstDatePrice && system[nm].firstDatePrice.market;
      if (firstPrice) {
        if (!fpd) fpd = firstPrice.price_usd;
        if (!fpb) fpb = firstPrice.price_btc;
      }
    }

    if (timeDiff) {
      if (currentPriceD && fpd) ret['d'] = 100 *
        (Math.pow(currentPriceD / fpd, 1 / timeDiff) - 1);
      if (currentPriceB && fpb) ret['b'] = 100 *
        (Math.pow(currentPriceB / fpb, 1 / timeDiff) - 1);
    }
    return ret;
  }

  var mg = getMonthlyGrowth();

  return {
    months: timeDiff,
    monthlyGrowthB: mg.b,
    monthlyGrowthD: mg.d,
    sum: 0.1
  }
};
