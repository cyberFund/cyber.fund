var ns = CF.CurrentData.calculatables;

ns.lib.calcs.calcWL = function calcWL(system) {
  // weighted liquidity
  var ret = {
    sum: 0,
    cap: 0,
    trade: 0
  }
  if (!system.metrics || !system.metrics.cap) return ret;
  var cap = system.metrics.cap.usd;

  var volumeDaily = system.metrics.tradeVolume;
  var absolute = system.metrics.cap.btc

  function getTradeScore(absolute, volumeDaily) {
    if (!absolute) {
      return 0;
    }
    var r = Math.abs(volumeDaily / absolute);
    if (r == 0) return 0;
    if (r < 0.0001) return 0.1;
    if (r < 0.001) return 0.2;
    if (r < 0.005) return 0.3;
    if (r < 0.02) return 0.4;
    return 0.5;
    return 0;
  }

  function getCapScore(c) {
    if (!c) return 0;
    var k = 1000,
      M = 1000000
    if (c < 10 * k) return 0;
    if (c < 100 * k) return 0.1;
    if (c < 1 * M) return 0.2;
    if (c < 10 * M) return 0.3;
    if (c < k * M) return 0.4;
    return 0.5;
  }

  ts = getTradeScore(absolute, volumeDaily);
  cs = getCapScore(cap);
  ret = {
    sum: cs + ts,
    cap: cs,
    trade: ts
  }
  return ret;
};
