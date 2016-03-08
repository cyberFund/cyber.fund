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
    return CF.UserAssets.getAccountsObject(Meteor.userId());
  },
  userAccounts: function(){
    return CF.UserAssets.getAccountsObject(CF.Profile.currentUid());
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
