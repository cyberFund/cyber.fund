segmentIoPublicKey = function() {
  try {
    return Meteor.settings.public.analyticsSettings["Segment.io"].apiKey;
  } catch (e) {
    return "not found";
  }
}

! function() {
  var analytics = window.analytics = window.analytics || [];
  if (!analytics.initialize)
    if (analytics.invoked) window.console && console.error && console.error("Segment snippet included twice.");
    else {
      analytics.invoked = !0;
      analytics.methods = ["trackSubmit", "trackClick", "trackLink", "trackForm", "pageview", "identify", "group", "track", "ready", "alias", "page", "once", "off", "on"];
      analytics.factory = function(t) {
        return function() {
          var e = Array.prototype.slice.call(arguments);
          e.unshift(t);
          analytics.push(e);
          return analytics
        }
      };
      for (var t = 0; t < analytics.methods.length; t++) {
        var e = analytics.methods[t];
        analytics[e] = analytics.factory(e)
      }
      analytics.load = function(t) {
        var e = document.createElement("script");
        e.type = "text/javascript";
        e.async = !0;
        e.src = ("https:" === document.location.protocol ? "https://" : "http://") + "cdn.segment.com/analytics.js/v1/" + t + "/analytics.min.js";
        var n = document.getElementsByTagName("script")[0];
        n.parentNode.insertBefore(e, n)
      };
      analytics.SNIPPET_VERSION = "3.0.1";
      analytics.load(segmentIoPublicKey());
    }
}();


Template.body.events({
  'click a[target="_blank"]': function(e, t) {
    if (analytics) {
      analytics.track("Clicked External Link", {
        link: $(e.currentTarget).attr('href')
      })
    }
  }
});

Meteor.startup(function() {
  Tracker.autorun(function(c) {
    var user = Meteor.user();
    if (!user) {
      Meteor.call("Who are you, Stranger?")
      return;
    }

    var identity = {};
    if (user.username) {
      identity.username = user.username;
    }
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
    Meteor.call("Arrival! new Arrival!")
    c.stop();
  });
});
