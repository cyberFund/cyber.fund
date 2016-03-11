CF.Utils.noClick = function() {
  return false;
};

CF.Utils.deltaPercents = function deltaPercents(base, another) {
  return 100 * (base - another) / base;
};

CF.Utils.readableNumbers = function(input) {
  while (/(\d+)(\d{3})/.test(input.toString())) {
    input = input.toString().replace(/(\d+)(\d{3})/, "$1" + "," + "$2");
  }
  return input;
};

CF.Utils.readableN = function(input, roundTo) { //roundTo - how many digits after dot
  var ret = parseFloat(input);
  if (isNaN(ret)) return "";
  return CF.Utils.readableNumbers(ret.toFixed(roundTo));
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

CF.User.twid = function() {
  var user = Meteor.user();
  if (!user) return '';
  return (user.profile && user.profile.twitterName) || '';
};

CF.User.linkToOwnProfile = function() {
  var twid = CF.User.twid();
  return twid ? '/@' + twid : '/'
}

CF.User.listFromIds = function(listFromIds) {
  return Meteor.users.find({
    _id: {
      $in: listFromIds
    }
  });
}

CF.User.get = CF.User.get || function getUser() {
  return Meteor.user();
}

CF.User.selectors = CF.User.selectors || {}
CF.User.selectors.userByTwid = CF.User.selectors.userByTwid ||
function userByTwid(twid) {
  return ({
    "profile.twitterName": twid
  });
}


Meteor.users.findOneByTwid = function(twid) {
  return Meteor.users.findOne({
    "profile.twitterName": twid
  });
}

CF.User.byTwid = function findUserByTwid (twid) {
  return Meteor.users.findOneByTwid(twid)
}

// WTF? use path segment here..
CF.Profile.currentTwid = new CF.Utils.SessionVariable('cfAssetsCurrentTwid');

CF.Profile.currentUid = function() {
  var u = Meteor.users.findOneByTwid(CF.Profile.currentTwid.get());
  return u ? u._id : undefined;
};
