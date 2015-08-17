Meteor.publish('ownAssets', function() {
  return Meteor.users.find({_id: this.userId}, {fields: {accounts: 1}});
});