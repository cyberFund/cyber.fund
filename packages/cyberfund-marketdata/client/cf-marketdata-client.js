CF.MarketData = CF.MarketData || {};
CF.MarketData.graphTime = {
  key: "CF.MarketData.graphTime",
  set: function(value) {
    if (!_Session) throw("no _Session");
    _Session.set(this.key, value)
  },
  get: function() {
    if (!_Session) throw("no _Session");
    return _Session.get(this.key);
  },
  default: function(value){
    if (!_Session) throw("no _Session");
    _Session.default(this.key, value);
  }
}

Meteor.startup(function(){
  CF.MarketData.graphTime.default("month");
});

var helpers = {
  dailyTradeVolumeToText: function (volumeDaily, absolute, needDigit) {
    //=0% - Illiquid
    //<0.01% - Very Low
    //< 0.1% - Low
    //< 0.5% - Normal
    //< 2% - High
    //`> 2% - Very High

    if (!absolute) {
      return needDigit ? 0 : "Normal";
    }

    if (Math.abs(volumeDaily / absolute) === 0) return needDigit ? 0 : "Illiquid";
    if (Math.abs(volumeDaily / absolute) < 0.0001) return needDigit ? 0.1 : "Very Low";
    if (Math.abs(volumeDaily / absolute) < 0.001) return needDigit ? 0.2 : "Low";
    if (Math.abs(volumeDaily / absolute) < 0.005) return needDigit ? 0.3 : "Normal";
    if (Math.abs(volumeDaily / absolute) < 0.02) return needDigit ? 0.4 : "High";
    return needDigit ? 0.5 : "Very High";
  },
  greenRedNumber: function (value) {
    return (value < 0) ? "red-text" : "green-text";
  },
  inflationToText: function (percents) {
    if (percents < 0) {
      return "Deflation " + (-percents).toFixed(2) + "%";
    } else if (percents > 0) {
      return "Inflation " + percents.toFixed(2) + "%";
    } else {
      return "Stable";
    }
  },
  percentsToTextUpDown: function (percents, precision) {
    if (!precision) precision = 2
    if (precision == 100) precision = 0

    if (percents < 0) {
      return "↓ " + (-percents.toFixed(precision)) + "%";
    } else if (percents > 0) {
      return "↑ " + percents.toFixed(precision) + "%";
    } else {
      return "= 0%";
    }
  },
  dayToDayTradeVolumeChange: function(system) {
    var metrics = system.metrics;
    if (metrics.tradeVolumePrevious && metrics.tradeVolumePrevious.day) {
      return CF.Utils.deltaPercents(metrics.tradeVolumePrevious.day, metrics.tradeVolume);
    }
    return 0;
  },
  chartdata: function(systemId/*, interval:: oneof ['daily', 'hourly']*/) {
    return MarketData.find({systemId: systemId});
  },
  chartdataOrdered: function(systemId/*, interval:: oneof ['daily', 'hourly']*/) {
    return MarketData.find({systemId: systemId}, {sort: {timestamp: -1}});
  },
  chartdataSubscriptionFetch: function(systemId/*, interval:: oneof ['daily', 'hourly']*/) {
    return MarketData.find({systemId: systemId}, {sort: {timestamp: -1}}). fetch();
  }

}

_.each(helpers, function(helper, key) {
  Template.registerHelper(key, helper);
});
