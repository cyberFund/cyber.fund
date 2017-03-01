import helpers from '/imports/api/client/cf/base/helpers'

_.each(helpers, function (helper, key) {
  Template.registerHelper(key, helper);
});

BlazeLayout.setRoot("body");

Tracker.autorun(function () {
  if (Meteor.user()) {
    Meteor.call("getUserNumber", function (err, ret) {
      Session.set("userRegistracionCount", ret);
    });
  }
});

FlowRouter.wait();
Meteor.startup(function () {
  CF.SubsMan = new SubsManager();
  CF.subs = {};
  Meteor.subscribe("userDetails", {
    onReady: function(){
      FlowRouter.initialize();
    }
  });
});
