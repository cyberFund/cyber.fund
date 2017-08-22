//todo move to db
const xchangeMarkets = {
  "http://api.bitfinex.com": {
    name: "Bitfinex",
    url: "http://bitfinex.com"
  },
  "http://api.kraken.com": {
    name: "Kraken",
    url: "http://kraken.com"
  },
  "http://bitbay.pl": {
    name: "BitBay",
    url: "http://bitbay.pl"
  },
  "http://bittrex.com": {
    name: "Bittrex",
    url: "http://bittrex.com"
  },
  "http://bleutrade.com": {
    name: "BlueTrade",
    url: "http://bleutrade.com"
  },
  "http://www.gatecoin.com": {
    name: "Gatecoin",
    url: "http://www.gatecoin.com"
  },
  "http://btc-e.com": {
    name: "BTC-e",
    url: "http://btc-e.com"
  },
  "http://bter.com": {
    name: "BTER",
    url: "http://bter.com"
  },
  "http://cex.io": {
    name: "CEX",
    url: "http://cex.io"
  },
  "http://coinbase.com": {
    name: "CoinBase",
    url: "http://coinbase.com"
  },
  "http://coinmate.io": {
    name: "Coinmate",
    url: "http://coinmate.io"
  },
  "http://hitbtc.com": {
    name: "HitBTC",
    url: "http://hitbtc.com"
  },
  "http://poloniex.com": {
    name: "Poloniex",
    url: "http://poloniex.com"
  },
  "http://www.bitstamp.net": {
    name: "BitStamp",
    url: "http://www.bitstamp.net"
  },
  "http://www.jubi.com": {
    name: "Jubi",
    url: "http://www.jubi.com"
  },
  "http://www.loyalbit.com": {
    name: "Loyalbit",
    url: "http://www.loyalbit.com"
  },
  "http://www.okcoin.cn": {
    name: "OKCoin",
    url: "http://www.okcoin.cn"
  },
  "https://api.quoine.com": {
    name: "Quoine",
    url: "https://quoine.com"
  },
  "https://data.mexbt.com": {
    name: "meXBT",
    url: "https://mexbt.com"
  },
  "https://lakebtc.com": {
    name: "LakeBTC",
    url: "https://lakebtc.com"
  },
}

const fiats = [
  ["British Pound Sterling", "GBP"],
  ["Canadian Dollar", "CAD"],
  ["Euro", "EUR"],
  ["Japanese Yen", "JPY"],
  ["US Dollar", "USD"]
]

module.exports = {
  xchangeMarkets: xchangeMarkets,
  fiats: fiats
}
