Template['navbar'].rendered = function () {
  $('.button-collapse').sideNav();
};

Template['navbar'].helpers({
  'foo': function () {
    
  }
});

Template['navbar'].events({
  'click #nav-mobile a': function (e, t) {
    Meteor.setTimeout(function triggerClick(){
      $('#sidenav-overlay').trigger('click');
    }, 280)

  }
});