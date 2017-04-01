import {normalizeOptionsPerUser} from '/imports/api/utils'
import { Meteor } from 'meteor/meteor'

Meteor.methods({
  followUser: function(targetId, options){
    options = options || {};
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

Meteor.publish("friendlyUsers", function(options){
  let username = options.username

  if (!username) return this.ready();
  var user = Meteor.users.findOne({username: username});
  if (!user) {
    console.log("no user by username: " + username);
    return this.ready();
  }
  if (!user.profile) return this.ready();
  var uids = _.union(user.profile["followedBy"] || [], user.profile["followingUsers"] || []);
  return Meteor.users.find({_id: {$in: uids}}, {fields: {
    "profile.name": 1,
    "username":  1,
    "avatar": 1  }})
});
