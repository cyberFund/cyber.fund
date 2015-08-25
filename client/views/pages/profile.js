CF.Profile.currentTwid = new CF.Utils.SessionVariable('cfAssetsCurrentTwid');
CF.Profile.currentUid = new CF.Utils.SessionVariable('cfAssetsCurrentUid');
Template['profile'].rendered = function () {
  
};

Template['profile'].helpers({
  'userRegistracionCount': function () {
    return Session.get("userRegistracionCount")
  },
  'ownProfile': function(){
    if (!Meteor.userId()) return false;
    return (CF.Profile.currentTwid.get() == CF.User.twid());
  },
  user: function(){
    return Meteor.users.findOneByTwid(CF.Profile.currentTwid.get())
  },
  'following': function(){
    var user = Meteor.user();

    return  user && user.profile && user.profile.followingUsers &&
      _.contains(Meteor.user().profile.followingUsers, CF.Profile.currentUid.get());
  },
  'followingCount': function(){
    var user = Meteor.users.findOne(CF.Profile.currentUid.get());
    return user && user.profile && user.profile.followingUsers && user.profile.followingUsers.length || 0

  },
  'followedByCount': function(){
    var user = Meteor.users.findOne(CF.Profile.currentUid.get());
    return user && user.profile && user.profile.followedBy && user.profile.followedBy.length || 0
  }
});

Template['profile'].events({
  'click .btn-follow': function (e, t) {
    Meteor.call('followUser', CF.Profile.currentUid.get())
  },
  'click .btn-unfollow': function(e, t){
    Meteor.call('followUser', CF.Profile.currentUid.get(), {unfollow: true})
  }
});