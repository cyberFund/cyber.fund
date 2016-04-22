CF.User = CF.User || {}
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

CF.User.get = function getUser() {
  return Meteor.user();
}

CF.User.selectors = {}
CF.User.selectors.userByTwid = function userByTwid(twid) {
  return ({
    "profile.twitterName": twid
  });
}

CF.User.findOneByTwid = function(twid) {
  return Meteor.users.findOne({
    "profile.twitterName": twid
  });
}
