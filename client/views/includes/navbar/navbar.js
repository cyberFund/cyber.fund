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
            collection: 'CurrentData',
            field: "aliases.CurrencyName",
            subscription: "search-sys",
            matchAll: true,
            template: Template.searchHelper,
            noMatchTemplate: Template.searchNoMatchedSearch
          },
          {
            token: '',
            collection: 'CurrentData',
            field: "system",
            subscription: "search-sys",
            matchAll: true,
            template: Template.searchHelper,
            noMatchTemplate: Template.searchNoMatchedSearch
          }
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