var helpers = {
  userFollowedByCount: function (user) {
    return user && user.profile && user.profile.followedBy &&
    user.profile.followedBy.length || 0;
  },
  userFollowsCount: function (user) {
    return user && user.profile && user.profile.followingUsers &&
    user.profile.followingUsers.length || 0;
  }
};

_.each(helpers, function (helper, key) {
  Template.registerHelper(key, helper);
});

Template.funds.onCreated(function(){
  var instance = this;
  instance.subscribe("usersWithFunds");
});

Template.funds.helpers({
  rows: function(){
    return Meteor.users.find({/*publicFunds: {$gt: 0}*/}, {
      limit: Session.get("showAllUsersAtFunds") ? 1000 : 50
    });
  }
});
