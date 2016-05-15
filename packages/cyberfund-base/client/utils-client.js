CF.Utils.noClick = function() {
  return false;
};

CF.Utils.deltaPercents = function deltaPercents(base, another) {
  return 100 * (base - another) / base;
};

CF.Utils.readableNumbers = function(input) {
  var f = true
  while (/(\d+)(\d{3})/.test(input.toString()) && f) {
    input = input.toString().replace(/(\d+)(\d{3})/, "$1" + "," + "$2");
  }
  return input;
};

CF.Utils.numberWithCommas = function(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

CF.Utils.readableN = function(input, roundTo) { //roundTo - how many digits after dot
  //var ret = parseFloat(input);
  //if (isNaN(ret)) return "";
  return d3.format(',.'+roundTo+'f')//CF.Utils.numberWithCommas(ret.toFixed(roundTo));
};

CF.Utils.formatters = {
  readableN0: d3.format(",.0f"),
  readableN1: d3.format(",.1f"),
  readableN2: d3.format(",.2f"),
  readableN3: d3.format(",.3f"),
  readableN4: d3.format(",.4f"),
  roundedN4: d3.format(",.4r"),
  meaningful4: d3.format(",.4g"),
  meaningful4Si: d3.format(",.4s"),
  percents: d3.format("%"),
  percents0: d3.format(".0%"),
  percents1: d3.format(".1%"),
  percents2: d3.format(".2%"),
  percents3: d3.format(".3%"),
}

CF.Utils.monetaryFormatter = function(input) {
  var postfix = "",
    value = input,
    formatter = CF.Utils.formatters.readableN2;
  if (input > 5000) {
    postfix = 'k';
    value = input / 1000;
    formatter = CF.Utils.formatters.readableN3;
  }
  if (input > 1000000) {
    postfix = 'M';
    value = input / 1000000
  }
  if (input > 1000000000) {
    postfix = "bln";
    value = input / 1000000000
  }
  return formatter(value) + postfix;
};

CF.Utils.SessionVariable = function(key) {
  if (!key) throw ("no key provided for SessionVariable constructor");
  var me = this;
  this._sessname = key;

  this.get = function() {
    return Session.get(me._sessname)
  };
  this.set = function(v) {
    Session.set(me._sessname, v);
  };
};

// WTF? use path segment here..
CF.Profile.currentUsername = function(){
  return FlowRouter.getParam("username");
};

CF.Profile.currentUid = function() {
  var u = CF.User.findOneByUsername(CF.Profile.currentUsername());
  return u ? u._id : null;
};
