const xchangeCurrent = require("./collections").feedsCurrent;
const feedUrl = 'http://kong.cyber.fund/xcm'
const print = CF.Utils.logger.getLogger("Xchange Feeds").print;

xchangeCurrent._ensureIndex({
  market: 1, base: 1, quote: 1
}, {unique: true, dropDups: true});

function fetch() {
  var res = HTTP.get(feedUrl, {
    timeout: 10000
  }, function(err, res) {
    if (err) print("Coukd not fetch", err, true)
    else {
      if (res.data && Array.isArray(res.data)) {
        res.data.forEach(function(it) {
          const _id = [it.quote, it.base, it.market].join('_')
          xchangeCurrent.upsert({
            _id: _id, market: it.market, quote: it.quote, base: it.base
          }, {$set: it})
        })
      }
    }
  });
}

exports.fetch = fetch
