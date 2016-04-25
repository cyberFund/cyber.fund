CF.User = CF.User || {}
CF.User.username = function() {
  var user = Meteor.user();
  if (!user) return '';
  return (user.username) || '';
};

CF.User.linkToOwnProfile = function() {
  var username = CF.User.username();
  return username ? '/@' + username : '/welcome'
}

CF.User.listFromIds = function getUsersByIds(listFromIds) {
  return Meteor.users.find({
    _id: {
      $in: listFromIds
    }
  });
}

CF.User.get = function getUser() {
  return Meteor.user();
}

CF.User.hasPublicAccess = function hasPublicAccess(user){
  return user && user.services && user.services.twitter && user.services.twitter.screenName;
}

CF.User.findOneByUsername = function findOneByUsername(username) {
  return Meteor.users.findOne({
    "username": username
  });
}


CF.User.selectors = {}
CF.User.selectors.userByUsername = function userByUsername(username) {
  return ({
    "username": username
  });
}
