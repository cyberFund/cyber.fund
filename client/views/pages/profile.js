CF.Profile.currentTwid = new CF.Utils.SessionVariable('cfAssetsCurrentTwid');
CF.Profile.currentUid = function () {
  var u = Meteor.users.findOneByTwid(CF.Profile.currentTwid.get());
  return u ? u._id : undefined;
};

Template['profile'].onCreated(function () {
  var instance = this;
  instance._subs = {};
  instance._registerSub = function (name, handler) {
    if (!name || !handler) return;
    instance._subs[name] = handler;
  };
  instance._unregisterSub = function (name) {
    if (!name) return;
    if (instance._subs[name] && instance._subs[name].stop) {
      instance._subs[name].stop();
    }
    delete instance._subs[name];

  };

  instance.autorun(function () {
    var uid = CF.Profile.currentUid();
    if (!uid) {
      instance._unregisterSub('1');
      instance._unregisterSub('2');
      instance._unregisterSub('3');
      return;
    }
    console.log(uid);
    var options = uid == Meteor.userId() ? {privateAssets: true} : {};
    instance._registerSub('1', instance.subscribe('friendlyUsers', uid));
    instance._registerSub('2', instance.subscribe('profilesSystems', uid));
    instance._registerSub('3', instance.subscribe('portfolioSystems', uid, options));
  });
});

Template['profile'].onCreated(function () {
  var instance = this;
  instance.autorun(function () {
    instance.subscribe('userProfileByTwid', FlowRouter.getParam('twid'))
  });
});

var _user = function getUserByCurrentUid() {
  return Meteor.users.findOne({_id: CF.Profile.currentUid()});
};

Template['profile'].helpers({
  'profileName': function () {
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
    return _user();
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
    var user = _user();
    return user.profile && user.profile.starredSystems &&
      CurrentData.find(CF.CurrentData.selectors.system(user.profile.starredSystems)) || []
  },
  'followingUsers': function () {
    var user = _user();
    return user.profile && user.profile.followingUsers &&
      Meteor.users.find({_id: {$in: user.profile.followingUsers}}) || []
  },
  'followedByUsers': function () {
    var user = _user();
    return user.profile && user.profile.followedBy &&
      Meteor.users.find({_id: {$in: user.profile.followedBy}}) || []
  },
  'followedByCount': function () {
    var user = _user();
    return user.profile && user.profile.followedBy && user.profile.followedBy.length || 0
  },

  biggerTwitterImg: function () {
    var user = _user();
    return user.profile && user.profile.twitterIconUrlHttps
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
  'click #at-nav-button': function (e, t) {
    analytics.track('Sign Out', {
      from: 'profile'
    })
  }
});