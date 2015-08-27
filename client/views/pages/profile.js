CF.Profile.currentTwid = new CF.Utils.SessionVariable('cfAssetsCurrentTwid');
CF.Profile.currentUid = new CF.Utils.SessionVariable('cfAssetsCurrentUid');
Template['profile'].rendered = function () {
  
};

Template['profile'].onCreated(function () {
  var instance = this;
  Tracker.autorun(function () {
    instance.subscribe('friendlyUsers', CF.Profile.currentUid.get());

    var user = Meteor.users.findOneByTwid(CF.Profile.currentTwid.get());
    var systems = user && user.profile && user.profile.starredSystems;
    if (systems && systems.length) {
      Meteor.subscribe('profilesSystems', systems);
    }
  });
})

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
    var ret = this.profile && this.profile.starredSystems &&
      CurrentData.find(CF.CurrentData.selectors.system(this.profile.starredSystems)) || []
    console.log( ret.fetch());
    return ret;
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
    return this.profile && this.profile.twitterIconUrl
      && Blaze._globalHelpers.biggerTwitterImg(this.profile.twitterIconUrl) || ''
  }
});

Template['profile'].events({
  'click .btn-follow': function (e, t) {
    Meteor.call('followUser', CF.Profile.currentUid.get())
  },
  'click .btn-unfollow': function (e, t) {
    Meteor.call('followUser', CF.Profile.currentUid.get(), {unfollow: true})
  }
});