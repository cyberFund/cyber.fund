var getDecimals = function (str) {
  var decimals = 6;
  var test = parseFloat(str);
  if (test > 0.1) decimals = 3;
  if (test < 0.0001) decimals = 8;
  return decimals;
};
var cfMarketData = {
  tooltipFncT: function (meta, value) {
    var ret = "Daily trade:========= Ƀ " + value;
    if (meta) {
      meta = meta.split("|"); // point date to be passed there, too
      var decimals = getDecimals(meta[0]);
      ret += "<br/>Ƀ " + Blaze._globalHelpers.satoshi_decimals(meta[0], decimals) + " per 1";
      if (meta[1]) ret += "<br/>" + meta[1];
    }
    return ret.replace(/\&nbsp\;/g, " ");
  },
  tooltipFncB: function (meta, value) {
    var ret = "====== =Ƀ= ========= " + value;
    if (meta) {
      meta = meta.split("|"); // point date to be passed there, too
      var decimals = getDecimals(meta[0]);
      ret += "<br/>Ƀ " + Blaze._globalHelpers.satoshi_decimals(meta[0], decimals) + " per 1";
      if (meta[1]) ret += "<br/>" + meta[1].replace("&nbsp;", " ");
    }
    return ret.replace("&nbsp;", " ");
  },
  tooltipFncS: function (meta, value) {
    var ret = "===========$ ============" + value;
    if (meta) {
      meta = meta.split("|"); // point date to be passed there, too
      if (meta[0]) {
        var decimals = getDecimals(meta[0]);
        ret += "<br/>$ " + Blaze._globalHelpers.satoshi_decimals(meta, decimals) + " per 1";
      }
      if (meta[1]) ret += "<br/>" + meta[1];
    }
    return ret;
  }
}

module.exports = cfMarketData
