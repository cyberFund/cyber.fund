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

CF.User.username = function() {
  var user = Meteor.user();
  if (!user) return '';
  return (user.username) || '';
};

CF.User.linkToOwnProfile = function() {
  var username = CF.User.username();
  return username ? '/@' + username : '/welcome'
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
CF.User.selectors.userByUsername = CF.User.selectors.userByUsername ||
function userByUsername(username) {
  return ({
    "username": username
  });
}


Meteor.users.findOneByUsername = function(username) {
  return Meteor.users.findOne({
    "username": username
  });
}

CF.User.byUsername = function findUserByUsername (username) {
  return Meteor.users.findOneByUsername(username)
}

// WTF? use path segment here..
CF.Profile.currentUsername = new CF.Utils.SessionVariable('cfAssetsCurrentUsername');

CF.Profile.currentUid = function() {
  var u = Meteor.users.findOneByUsername(CF.Profile.currentUsername.get());
  return u ? u._id : undefined;
};
