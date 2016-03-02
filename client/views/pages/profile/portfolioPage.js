// this only works for current user.

CF.UserAssets.getAccountsObjectOther = function (userId) {
  userId = userId || Meteor.userId()
  var user = Meteor.users.findOne({_id: userId})//,
  //  options = {privateAssets: false}//Session.get("portfolioOptions") || {};//todo: factor out
  if (!user) return {};
  var accounts = user.accounts;

  if (userId == Meteor.userId()) {
     _.extend(accounts, user.accountsPrivate || {})
   }
  return accounts;
};


CF.UserAssets.getAccountsObject = function () {
  var user = Meteor.user(),
    options = Session.get("portfolioOptions") || {};//todo: factor out
  if (!user) return {};
  var accounts = user.accounts;

   if (options.privateAssets) {
     _.extend(accounts, user.accountsPrivate || {})
   }
  return accounts;
};

Template['portfolioPage'].onCreated(function() {
  var self = this;
  self.autorun(function() {
    //var postId = FlowRouter.getParam('postId');
    self.subscribe('portfolioUser', Meteor.userId())
  });
});

Template['portfolioPage'].rendered = function () {

};

Template['portfolioPage'].helpers({
  currentUserAccounts: function(){
    return CF.UserAssets.getAccountsObjectOther(Meteor.userId());
  },
  userAccounts: function(){
    return CF.UserAssets.getAccountsObjectOther(CF.Profile.currentUid());
  }
});

Template['portfolioPage'].events({
  'click .check-balance': function (e, t) {
    e.preventDefault();
    var val = $(e.currentTarget).closest("form").find("input#account").val();

    Meteor.call("cfCheckBalance", val, function (err, ret) {

    })
  }
});
