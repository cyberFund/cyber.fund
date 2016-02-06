CF = CF || {}

CF .User = CF.User || {}
CF.User .get = CF.User.get || function getUser() {
  return Meteor.user();
}

CF.User .selectors = CF.User.selectors || {}
CF.User.selectors .userByTwid = CF.User.selectors.userByTwid ||
function userByTwid(twid) {
  return ({
    "profile.twitterName": twid
  });
}

CF .Utils = CF.Utils || {}
CF .Profile = CF.Profile || {}

Extras = new Meteor.Collection("extras");

Meteor.users .findOneByTwid = function(twid) {
  return Meteor.users.findOne({
    "profile.twitterName": twid
  });
}
