import {CurrentData, Extras} from '/imports/api/collections'
function isAutonomous(item) { //chaingear artifact
  return !item.dependencies || item.dependencies == "independent" || item.dependencies.indexOf("independent") >= 0;
}

function calcTotalCap() {

  var cap = 0;
  var capDayAgo = 0;
  var autonomous = 0;
  var dependent = 0;
  CurrentData.find({}, {
    "metrics.cap": 1,
    "dependencies": 1
  }).forEach(function(sys) {
    if (sys.metrics && sys.metrics.cap && sys.metrics.cap.btc) {
      cap += +sys.metrics.cap.btc;
      if (isAutonomous(sys)) {
        autonomous++;
      } else {
        dependent++;
      }

      if (sys.metrics.capChange && sys.metrics.capChange.day && sys.metrics.capChange.day.btc ) {
        capDayAgo += sys.metrics.cap.btc - sys.metrics.capChange.day.btc;
      }
    }

  });

  console.log(cap)
  
  return {
    btc: cap,
    btcDayAgo: capDayAgo,
    autonomous: autonomous,
    dependent: dependent
  };
};

var saveTotalCap = function() {
  var btcMetrics = CurrentData.findOne({
    _id: "Bitcoin"
  }, {
    fields: {
      "metrics": 1
    }
  });
  btcMetrics = btcMetrics && btcMetrics.metrics;
  if (!btcMetrics) return;

  var btcPrice = btcMetrics.price && btcMetrics.price.usd;
  var btcPriceDayAgo = btcPrice - (btcMetrics.priceChange && btcMetrics.priceChange.day &&
    btcMetrics.priceChange.day.usd || 0);

  var cap = calcTotalCap();
  if (cap) {

    Extras.upsert({
      _id: "total_cap"
    }, _.extend(cap, {
      usd: cap.btc * btcPrice,
      btc: cap.btc,
      usdDayAgo: cap.btcDayAgo * btcPriceDayAgo,
      btcDayAgo: cap.btcDayAgo
    }));
  }
};

export {
  saveTotalCap
}
