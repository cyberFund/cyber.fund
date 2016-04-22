Meteor.publish('profileAssets', function(username) {
  // is own?
  var isOwn = false;
  var user = Meteor.users.findOne({_id: this.userId});
  if (user) {
    if (user.username == username) isOwn = true;
  }

  return Meteor.users.find({'username' : username},
    {fields: CF.UserAssets.accountsFields (isOwn)});
});
