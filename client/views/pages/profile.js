CF.Profile.currentTwid = new CF.Utils.SessionVariable('cfAssetsCurrentTwid');
CF.Profile.currentUid = function(){
  var u = Meteor.users.findOneByTwid(CF.Profile.currentTwid.get());
  return u ? u._id : undefined;
};

Template['profile'].rendered = function () {
  var options = CF.Profile.currentUid() == Meteor.userId() ? {privateAssets: true} : {};
  this.subscribe('friendlyUsers', CF.Profile.currentUid());
  this.subscribe('profilesSystems', CF.Profile.currentUid());
  this.subscribe('portfolioSystems', CF.Profile.currentUid(), options);
};

Template['profile'].onCreated(function () {
  var instance = this;
  instance.autorun(function(){
    instance.subscribe('userProfileByTwid',  FlowRouter.getParam('twid'))
  });
});

Template['profile'].helpers({
  'profileName': function(){
    return this.profile && this.profile.name
  },
  'userRegistracionCount': function () {
    return Session.get("userRegistracionCount")
  },
  "isOwnProfile": function () {
    if (!Meteor.userId()) return false;
    return (CF.Profile.currentTwid.get() == CF.User.twid()); //todo: get rid of twid, use user._id instead
  },
  user: function () {
    return Meteor.users.findOne({_id: CF.Profile.currentUid()})
  },
  'following': function () {
    var user = Meteor.user();
    if (!user) return false;
    return user.profile && user.profile.followingUsers &&
      _.contains(user.profile.followingUsers, CF.Profile.currentUid());
  },
  'followingCount': function () {
    return this.profile && this.profile.followingUsers && this.profile.followingUsers.length || 0
  },
  'starred': function () {
    return this.profile && this.profile.starredSystems &&
      CurrentData.find(CF.CurrentData.selectors.system(this.profile.starredSystems)) || []
  },
  'followingUsers': function () {
    return this.profile && this.profile.followingUsers &&
      Meteor.users.find({_id: {$in: this.profile.followingUsers}}) || []
  },
  'followedByUsers': function () {
    return this.profile && this.profile.followedBy &&
      Meteor.users.find({_id: {$in: this.profile.followedBy}}) || []
  },
  'followedByCount': function () {
    return this.profile && this.profile.followedBy && this.profile.followedBy.length || 0
  },

  biggerTwitterImg: function () {
    return this.profile && this.profile.twitterIconUrlHttps
      && Blaze._globalHelpers.biggerTwitterImg(this.profile.twitterIconUrlHttps) || ''
  }
});

Template['profile'].events({
  'click .btn-follow': function (e, t) {
    analytics.track('Followed Person', {
      personName: CF.Profile.currentTwid.get()
    });
    if (!Meteor.user()) FlowRouter.go("/welcome");
    Meteor.call('followUser', CF.Profile.currentUid())
  },
  'click .btn-unfollow': function (e, t) {
    analytics.track('Unfollowed Person', {
      personName: CF.Profile.currentTwid.get()
    });
    if (!Meteor.user()) FlowRouter.go("/welcome");
    Meteor.call('followUser', CF.Profile.currentUid(), {unfollow: true})
  },
  'click #at-nav-button': function(e, t){
    analytics.track('Sign Out', {
      from: 'profile'
    })
  }
});