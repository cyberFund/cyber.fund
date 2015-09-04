Meteor.publish('profileAssets', function(twid) {
  // is own?
  var isOwn = false;
  var user = Meteor.users.findOne({_id: this.usrId});
  if (user) {
    if (user.profile && (user.profile.twitterName == twid)) isOwn = true;
  }
  var fields = isOwn ? {accounts: 1, accountsPrivate: 1} : {accounts: 1}

  return Meteor.users.find({'profile.twitterName' : twid}, {fields: fields});
});