Template['navbar'].rendered = function () {
  $('.button-collapse').sideNav();
};

Tracker.autorun(function(){
  var user = Meteor.user();
  if (user && user.profile && !user.profile.twitterName) Meteor.call("patchProfile")
});

Template['navbar'].helpers({
});

Template['navbar'].events({
  'click #nav-mobile a': function (e, t) {
    Meteor.setTimeout(function triggerClick(){
      $('#sidenav-overlay').trigger('click');
    }, 280)

  }
});