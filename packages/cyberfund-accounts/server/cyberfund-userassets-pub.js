Meteor.publish('profileAssets', function(username) {
  // is own?
  var isOwn = false;
  var user = Meteor.users.findOne({_id: this.userId});
  if (user) {
    if (user.username == username) isOwn = true;
  }
  var userId = CF.User.findOneByUsername(username);
  return CF.Accounts._findByUserId(userId, {private:isOwn});
});
