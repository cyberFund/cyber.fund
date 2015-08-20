CF.MarketData.graphTime = new CF.Utils.SessionVariable("CF.MarketData.graphTime");
Meteor.startup(function(){
  if (!Session.get('CF.MarketData.graphTime')) CF.MarketData.graphTime.set("all");
});

CF.MarketData.tooltipFncB = function (v, k) {
  var ret = "Ƀ " + CF.Utils.readableN(k, 2);
  if (v) {
    v= v.split("|"); // point date to be passed there, too
    var decimals = 6;
    if (v[0]>0.1) decimals = 3;
    if (v[0]<0.0001) decimals = 8;
    ret+= "<br/>Ƀ " + Blaze._globalHelpers.satoshi_decimals(v[0], decimals) + " per 1";

    if (v[1]) ret += "<br/><br/>v[1]";
    return ret;
  }
};

CF.MarketData.tooltipFncS = function (v, k) {
  var ret = "$ " + CF.Utils.readableN(k, 2) ;
  if (v) {
    var decimals = 6;
    if (v>0.1) decimals = 3;
    if (v<0.0001) decimals = 8;
    ret+= "<br/><br/>Ƀ " + Blaze._globalHelpers.satoshi_decimals(v, decimals) + " per 1";
    return ret;
  }
};