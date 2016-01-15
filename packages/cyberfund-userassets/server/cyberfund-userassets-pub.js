Meteor.publish('profileAssets', function(twid) {
  // is own?
  var isOwn = false;
  var user = Meteor.users.findOne({_id: this.userId});

  if (user) {
    if (user.profile && (user.profile.twitterName == twid)) isOwn = true;
  }

  return Meteor.users.find({'profile.twitterName' : twid},
    {fields: CF.UserAssets.accountsFields (isOwn)});
});
