BlazeLayout.setRoot('body');

Tracker.autorun(function () {

  if (Meteor.user()) {
    Meteor.call("getUserNumber", function (err, ret) {
      Session.set("userRegistracionCount", ret)
    })
  }
});

FlowRouter.wait();
Meteor.startup(function () {
  Meteor.subscribe('userDetails', {
    onReady: function(){
      FlowRouter.initialize();
    }
  });
  Meteor.subscribe("BitcoinPrice");
  Meteor.subscribe('usersCount');
  Meteor.subscribe('coinsCount');
});
