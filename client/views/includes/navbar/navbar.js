Template['navbar'].rendered = function () {
  $('.button-collapse').sideNav();
};
/*
Tracker.autorun(function(){
  var user = Meteor.user();
  if (user && user.profile && !user.profile.twitterName) Meteor.call("patchProfile")
});
*/
Template['navbar'].helpers({
  isActiveOwnProfile: function(){
    var user = Meteor.user(); if (!user) return ''
    var twittername = user.profile && user.profile.twitterName;
    if (!twittername) return ''
    return (location.pathname == '/@'+twittername) ? 'active': ''
  }
});

Template['navbar'].events({
  'click #nav-mobile a': function (e, t) {
    Meteor.setTimeout(function triggerClick(){
      $('#sidenav-overlay').trigger('click');
    }, 280)

  }
});