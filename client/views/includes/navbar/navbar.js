Template['navbar'].rendered = function () {
  $('.button-collapse').sideNav();
};

Tracker.autorun(function(){
  var user = Meteor.user();
  if (user && user.profile && !user.profile.twitterName) Meteor.call("patchProfile")
});

Template['navbar'].helpers({
  'searchSettings': function () {
      return {
        position: "bottom",
        limit: 5,
        rules: [
          {
            token: '',
            collection: CurrentData,
            field: "system",
            template: Template.searchHelper
          }/*,
          {
            token: '!',
            collection: Dataset,
            field: "_id",
            options: '',
            matchAll: true,
            filter: { type: "autocomplete" },
            template: Template.dataPiece
          }*/
        ]
      };
  }
});

Template['navbar'].events({
  'click #nav-mobile a': function (e, t) {
    Meteor.setTimeout(function triggerClick(){
      $('#sidenav-overlay').trigger('click');
    }, 280)

  }
});