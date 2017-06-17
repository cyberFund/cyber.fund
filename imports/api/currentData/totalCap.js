import {CurrentData, Extras} from '/imports/api/collections'


// meta: vocabulary context: currentData
function isIndependent(item) { //chaingear artifact
  return !item.dependencies || item.dependencies == "independent" || item.dependencies.indexOf("independent") >= 0;
}

function calcTotalCap() {
  let cap = 0;
  let capDayAgo = 0;
  let autonomous = 0;
  let dependent = 0;
  CurrentData.find({}, {
    "metrics.cap": 1,
    "dependencies": 1
  }).forEach(function(sys) {
    if (sys.metrics && sys.metrics.cap && sys.metrics.cap.btc) {
      cap += +sys.metrics.cap.btc;
      if (isIndependent(sys)) {
        autonomous++;
      } else {
        dependent++;
      }

      if (sys.metrics.capChange && sys.metrics.capChange.day && sys.metrics.capChange.day.btc ) {
        capDayAgo += +sys.metrics.cap.btc - sys.metrics.capChange.day.btc;
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

function totalCapDoc() {
  return Extras.findOne({
    _id: "total_cap"
  });
}

export {
  saveTotalCap, totalCapDoc
}
