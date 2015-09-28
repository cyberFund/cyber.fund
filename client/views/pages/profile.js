CF.Profile.currentTwid = new CF.Utils.SessionVariable('cfAssetsCurrentTwid');
CF.Profile.currentUid = new CF.Utils.SessionVariable('cfAssetsCurrentUid');

Template['profile'].rendered = function () {
  this.subscribe('friendlyUsers', CF.Profile.currentUid.get());
  this.subscribe('profilesSystems', CF.Profile.currentUid.get());
  this.subscribe('portfolioSystems', CF.Profile.currentUid.get());
};

Template['profile'].onCreated(function () {

});

Template['profile'].helpers({
  'userRegistracionCount': function () {
    return Session.get("userRegistracionCount")
  },
  'ownProfile': function () {
    if (!Meteor.userId()) return false;
    return (CF.Profile.currentTwid.get() == CF.User.twid()); //todo: get rid of twid, use user._id instead
  },
  user: function () {
    return Meteor.users.findOne({_id: CF.Profile.currentUid.get()})
  },
  'following': function () {
    var user = Meteor.user();
    return user.profile && user.profile.followingUsers &&
      _.contains(user.profile.followingUsers, CF.Profile.currentUid.get());
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
    Meteor.call('followUser', CF.Profile.currentUid.get())
  },
  'click .btn-unfollow': function (e, t) {
    analytics.track('Unfollowed Person', {
      personName: CF.Profile.currentTwid.get()
    });
    Meteor.call('followUser', CF.Profile.currentUid.get(), {unfollow: true})
  }
});