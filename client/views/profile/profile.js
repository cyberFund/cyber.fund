import cfCDs from '/imports/api/currentData/selectors'
import {CurrentData} from '/imports/api/collections'
import {findByUsername} from '/imports/api/utils/user'
import {findByRefId} from '/imports/api/cf/accounts/utils'
import {currentUid, currentUsername} from '/imports/api/cf/profile'
import uaGraph from '/imports/api/cf/userAssets/graph'
import {Meteor} from 'meteor/meteor'

Template['profile'].onCreated(function() {
  var instance = this;

  instance.autorun(function() {
    var username = FlowRouter.getParam('username');

    if (uaGraph && uaGraph.folioPie){ //crutch
      uaGraph.folioPie.update({
        labels: [],
        series: []
      })
    }

    instance.subscribe('portfolioSystems', {username: username});
    instance.subscribe('userProfile', {username: username}, {onReady: function(){
      instance.subscribe('friendlyUsers', {username: username}, {onReady: function(){
        if (username) Meteor.call("cfAssetsUpdateBalances", {username: username}, function(err, ret){});
      }});
    }});

  });

  instance.autorun(function() {
    var username = FlowRouter.getParam('username');
    var user = findByUsername(username)
    var name = user && user.profile && user.profile.name || username;
    document.title = name + ' - ' + 'cyber • Fund';
  });
});

Template['profile'].onRendered(function(){
  $('ul.tabs').tabs();
})

var _user = function(){
  return findByUsername(FlowRouter.getParam('username'));
}

Template['profile'].helpers({
  userAccounts: function(){
    return findByRefId(currentUid()).fetch();
  },
  profileName: function() {
    return this.profile && this.profile.name
  },
  userRegistracionCount: function() {
    return Session.get("userRegistracionCount")
  },
  isOwnProfile: function() {
    if (!Meteor.userId()) return false;
    return (currentUsername() == Meteor.user().username );
  },
  user: function() {
    return _user();
  },
  following: function() { //whether current user is followed by client user
    var user = Meteor.user();
    if (!user) return false;
    return user.profile && user.profile.followingUsers &&
      _.contains(user.profile.followingUsers, currentUid());
  },
  followingCount: function() { //
    var user = _user();
    return user.profile && user.profile.followingUsers && user.profile.followingUsers.length || 0
  },
  starred: function() {
    var user = _user();
    return user.profile && user.profile.starredSystems &&
      CurrentData.find(cfCDs.system(user.profile.starredSystems)) || []
  },
  followingUsers: function() {
    var user = _user();
    return user.profile && user.profile.followingUsers &&
      Meteor.users.find({
        _id: {
          $in: user.profile.followingUsers
        }
      }) || []
  },
  followedByUsers: function() {
    var user = _user();
    return user.profile && user.profile.followedBy &&
      Meteor.users.find({
        _id: {
          $in: user.profile.followedBy
        }
      }) || []
  },
  followedByCount: function() {
    var user = _user();
    return user.profile && user.profile.followedBy && user.profile.followedBy.length || 0
  }
});

Template['profile'].events({
  'click .btn-follow': function(e, t) {
    analytics.track('Followed Person', {
      personName: currentUsername()
    });
    if (!Meteor.user()) FlowRouter.go("/welcome");
    Meteor.call('followUser', currentUid())
  },
  'click .btn-unfollow': function(e, t) {
    analytics.track('Unfollowed Person', {
      personName: currentUsername()
    });
    if (!Meteor.user()) FlowRouter.go("/welcome");
    Meteor.call('followUser', currentUid(), {
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
