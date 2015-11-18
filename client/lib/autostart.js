BlazeLayout.setRoot('body');

Tracker.autorun(function () {
  Meteor.subscribe('userDetails');
  Meteor.subscribe("BitcoinPrice")
  if (Meteor.user()) {
    Meteor.call("getUserNumber", function (err, ret) {
      Session.set("userRegistracionCount", ret)
    })
  }
});

Meteor.startup(function () {
  Meteor.subscribe('usersCount');
  Meteor.subscribe('coinsCount');
});

// track pages
if (Package['iron:router']) {
  Package['iron:router'].Router.onRun(function () {
    var router = this;
    Tracker.afterFlush(function () {
        analytics.page(router.route.getName());
    });
    this.next();
  });
}