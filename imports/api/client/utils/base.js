var cfUtils = {}
cfUtils.noClick = function() {
  return false;
};

cfUtils.deltaPercents = function deltaPercents(base, another) {
  return 100 * (base - another) / base;
};

cfUtils.readableNumbers = function(input) {
  var f = true;
  while (/(\d+)(\d{3})/.test(input.toString()) && f) {
    input = input.toString().replace(/(\d+)(\d{3})/, "$1" + "," + "$2");
  }
  return input;
};

cfUtils.numberWithCommas = function(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

cfUtils.readableN = function(input, roundTo) { //roundTo - how many digits after dot
  //var ret = parseFloat(input);
  //if (isNaN(ret)) return "";
  return d3.format(",."+roundTo+"f");//cfUtils.numberWithCommas(ret.toFixed(roundTo));
};

cfUtils.formatters = {
  readableN0: d3.format(",.0f"),
  readableN1: d3.format(",.1f"),
  readableN2: d3.format(",.2f"),
  readableN3: d3.format(",.3f"),
  readableN4: d3.format(",.4f"),
  readableN8: d3.format(",.8f"),
  roundedN4: d3.format(",.4r"),
  meaningful3: d3.format(",.4g"),
  meaningful4: d3.format(",.4g"),
  meaningful4Si: d3.format(",.4s"),
  percents: d3.format("%"),
  percents0: d3.format(".0%"),
  percents1: d3.format(".1%"),
  percents2: d3.format(".2%"),
  percents3: d3.format(".3%"),
  withSign: d3.format("+,")
};

cfUtils.monetaryFormatter = function(input) {
  var postfix = "",
    value = input,
    formatter = cfUtils.formatters.readableN2;
  if (input > 5000) {
    postfix = "k";
    value = input / 1000;
    formatter = cfUtils.formatters.readableN3;
  }
  if (input > 1000000) {
    postfix = "M";
    value = input / 1000000;
  }
  if (input > 1000000000) {
    postfix = "bln";
    value = input / 1000000000;
  }
  return formatter(value) + postfix;
};


// provides memoizing of session values. depends on 'amplify' script/package
// simply use cfUtils._session instead of Session to store global things, like
// sorting preference etc

// using session as it already reactive. and storing changes via amplify
cfUtils._session = {
  _prefixKey: "Session|",

  /**
   * loads value from
   * @param key
   */
  get: function(key) {
  ////  ret = amplify.store(cfUtils._session._prefixKey + key);
  ////  if (Session.get(key) != ret) Session.set(key, ret);
  ////  return ret;
    return Session.get(key)
  },

  set: function(key, value) {
  ////  amplify.store(cfUtils._session._prefixKey + key, value);
  ////  Session.set(key, value);
    Session.set(key, value);
  },

  default: function(key, value) {
    if (cfUtils._session.get(key) == undefined) cfUtils._session.set(key, value);
  }
};

module.exports = cfUtils
