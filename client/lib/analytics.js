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
  'click a[target="_blank"]': function(e, t){
    Meteor.call("_trackAnalytics", {
      event: "Clicked External Link",
      properties: {
        link: $(e.currentTarget).attr('href')
      }
    })
  }
});


Meteor.startup(function() {
  Tracker.autorun(function(c) {
    // waiting for user subscription to load
    if (! Router.current() || ! Router.current().ready())
      return;

    var user = Meteor.user();
    if (! user)
      return;

    analytics.identify(user._id, {
      name: user.profile ? user.profile.name : "",
      email: user.emails[0].address
    });

    c.stop();
  });
});