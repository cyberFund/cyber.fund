/*Meteor.autorun(function (c) {
 // waiting for user subscription to load
 if (!Router.current() || !Router.current().ready()) {
 return;
 }

 var user = Meteor.user();
 if (!user) {
 return;
 }

 analytics.identify(user._id, {
 name: user.profile ? user.profile.name : "",
 email: user.emails[0].address
 });

 c.stop();
 });
 */

Template.body.events({
  'click a[target="_blank"]': function (e, t) {
    if (analytics) {
      console.log('track');
      analytics.track("Clicked External Link",
        {
          link: $(e.currentTarget).attr('href')
        })
    }
  }
});

Meteor.startup(function () {

  Tracker.autorun(function (c) {
    // waiting for user subscription to load
    if (!Router.current() || !Router.current().ready()) {
      return;
    }
    var user = Meteor.user();
    if (!user) {
      return;
    }

    var identity = {};
    if (user.profile) {
      identity.name = user.profile.name;
    }
    if (user.emails) {
      identity.email = user.emails[0].address
    }
    if (user.services) {
      if (user.services.twitter) {
        identity.twitter = user.services.twitter.screenName;
      }
    }
    analytics.identify(user._id, identity);

    c.stop();
  });
});