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
  var ret = parseFloat(input);
  if (isNaN(ret)) return "";
  return CF.Utils.numberWithCommas(ret.toFixed(roundTo));
};

CF.Utils.monetaryFormatter = function(input) {
  var postfix = "",
    value = input,
    decimals = 2;
  if (input > 5000) {
    postfix = 'k';
    value = input / 1000;
    decimals = 3;
  }
  if (input > 1000000) {
    postfix = 'M';
    value = input / 1000000
  }
  if (input > 1000000000) {
    postfix = "bln";
    value = input / 1000000000
  }
  return CF.Utils.readableN(value, decimals) + postfix;
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
