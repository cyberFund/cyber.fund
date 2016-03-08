BlazeLayout.setRoot('body');

Tracker.autorun(function () {

  if (Meteor.user()) {
    Meteor.call("getUserNumber", function (err, ret) {
      Session.set("userRegistracionCount", ret)
    })
  }
});

Meteor.startup(function () {
  Meteor.subscribe('userDetails');
  Meteor.subscribe("BitcoinPrice");
  Meteor.subscribe('usersCount');
  Meteor.subscribe('coinsCount');
});
