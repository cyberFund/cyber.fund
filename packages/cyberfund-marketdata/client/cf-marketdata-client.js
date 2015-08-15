CF.MarketData.graphTime = new CF.Utils.SessionVariable("CF.MarketData.graphTime");
CF.MarketData.tooltipFncB = function (v, k) {
  return "Ƀ " + CF.Utils.readableN(k, 2);
};

CF.MarketData.tooltipFncS = function (v, k) {
  return "$ " + CF.Utils.readableN(k, 2);
};