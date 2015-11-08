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
      //var page = router.route.getName();
      //if (exceptions.indexOf(page) == -1)
        analytics.page( router.route.getName());
    });
    this.next();
  });
}