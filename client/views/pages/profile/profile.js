
Template['profile'].onCreated(function() {
  var instance = this;

  instance.autorun(function() {

    var uid = CF.User.findOneByUsername(FlowRouter.getParam('username'));
    uid = uid && uid._id;
    console.log("AUTORUN uid", uid)
    if (uid)
      Meteor.call("cfAssetsUpdateBalances", {userId: uid});
    instance.subscribe('friendlyUsers', uid);
    instance.subscribe('portfolioSystems', uid);
    instance.subscribe('userProfileById', uid)
  });
});

Template['profile'].onCreated(function() {
  var instance = this;
  instance.autorun(function() {

  });
});

var _user = function getUserByCurrentUid() {
  return Meteor.users.findOne({
    _id: CF.Profile.currentUid()
  });
};

Template['profile'].helpers({
  currentUserAccounts: function(){
    return CF.UserAssets.getAccountsObject(Meteor.userId());
  },
  userAccounts: function(){
    return CF.UserAssets.getAccountsObject(CF.Profile.currentUid());
  },
  'profileName': function() {
    return this.profile && this.profile.name
  },
  'userRegistracionCount': function() {
    return Session.get("userRegistracionCount")
  },
  "isOwnProfile": function() {
    if (!Meteor.userId()) return false;
    return (CF.Profile.currentUsername.get() == CF.User.username());
  },
  user: function() {
    return _user();
  },
  'following': function() { //whether current user is followed by client user
    var user = Meteor.user();
    if (!user) return false;
    return user.profile && user.profile.followingUsers &&
      _.contains(user.profile.followingUsers, CF.Profile.currentUid());
  },
  'followingCount': function() { //
    var user = _user();
    return user.profile && user.profile.followingUsers && user.profile.followingUsers.length || 0
  },
  'starred': function() {
    var user = _user();
    return user.profile && user.profile.starredSystems &&
      CurrentData.find(CF.CurrentData.selectors.system(user.profile.starredSystems)) || []
  },
  'followingUsers': function() {
    var user = _user();
    return user.profile && user.profile.followingUsers &&
      Meteor.users.find({
        _id: {
          $in: user.profile.followingUsers
        }
      }) || []
  },
  'followedByUsers': function() {
    var user = _user();
    return user.profile && user.profile.followedBy &&
      Meteor.users.find({
        _id: {
          $in: user.profile.followedBy
        }
      }) || []
  },
  'followedByCount': function() {
    var user = _user();
    return user.profile && user.profile.followedBy && user.profile.followedBy.length || 0
  }
});

Template['profile'].events({
  'click .btn-follow': function(e, t) {
    analytics.track('Followed Person', {
      personName: CF.Profile.currentUsername.get()
    });
    if (!Meteor.user()) FlowRouter.go("/welcome");
    Meteor.call('followUser', CF.Profile.currentUid())
  },
  'click .btn-unfollow': function(e, t) {
    analytics.track('Unfollowed Person', {
      personName: CF.Profile.currentUsername.get()
    });
    if (!Meteor.user()) FlowRouter.go("/welcome");
    Meteor.call('followUser', CF.Profile.currentUid(), {
      unfollow: true
    })
  },
  'click #at-nav-button': function(e, t) {
    analytics.track('Sign Out', {
      from: 'profile'
    });
    Meteor.logout()
  }
});
