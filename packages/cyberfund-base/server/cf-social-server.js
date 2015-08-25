// todo: move to dedicated package.
// move /profile template there, too.
Meteor.methods({
  followUser: function(targetId, options){
    options = options || {};
  console.log(targetId);
    console.log(options);
    var  userId = this.userId,
      selTarget = {_id: targetId},
      selOwn = {_id: userId};
    if (!userId || !Meteor.users.find(selTarget).count()) return;
    if (options.unfollow) {
      Meteor.users.update(selOwn, {$pull: {"profile.followingUsers": targetId}});
      Meteor.users.update(selTarget, {$pull: {"profile.followedBy": userId}});
    } else {
      Meteor.users.update(selOwn, {$push: {"profile.followingUsers": targetId}});
      Meteor.users.update(selTarget, {$push: {"profile.followedBy": userId}});
    }
  }
})