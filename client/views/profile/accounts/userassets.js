// get accounts object.
// for own user add privates
CF.UserAssets.getAccounts = function (userId) {
  var user = Meteor.users.findOne({_id: userId})//,
  if (!user) return {};
  var accounts = user.accounts || {};

  if (userId == Meteor.userId()) {
     _.extend(accounts, user.accountsPrivate || {})
   }
  return accounts;
};
