Template['userProfile'].rendered = function () {
  
};

Template['userProfile'].helpers({
  'userData0': function () {
    var twid = Router.current().params.twid
    return Meteor.users.findOne({'profile.twitterName': twid})
  }
});

Template['userProfile'].events({
  'click .bar': function (e, t) {
    
  }
});