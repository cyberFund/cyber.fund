//FlowRouter.triggers.enter([cb1, cb2]);
//FlowRouter.triggers.exit([cb1, cb2]);

// filtering
//FlowRouter.triggers.enter([trackRouteEntry], {only: ["home"]});
//FlowRouter.triggers.exit([trackRouteExit], {except: ["home"]});


// this one redirects user to his profile.
// so far only twitter accounts are used

function redirectLoggedToProfile(context, redirect) {
  if (Meteor.user()) {
    redirect("/@:username", {
      username: CF.User.username()
    });
  }
}

// this one redirects non-logged to dedicated page.

function redirectGuestToWelcome(context, redirect) {
  if (!Meteor.user()) {
    redirect("/welcome");
  }
}

// those are things that are run before
// the current router

FlowRouter.triggers.enter([
  function flashOnLoad(context, redirect) {
    $("html, body").animate({
      scrollTop: 0
    }, 400);

    $("#main").hide().fadeIn(500);
    var $nav = $("#navicon");
    if ($nav && $nav.hasClass("open")) {
      $("body").animate({
        left: "0px"
      }, 200).css({
        "overflow": "scroll"
      });
      $("#main-nav").animate({
        right: "-250px"
      }, 200);
      $nav.removeClass("open").addClass("closed").html("&#9776; MENU");
      $(".fade").fadeOut();
    }
  },
  function setTitle(context, redirect) {
    var routeName = context.route.name;
    document.title = routeName ? routeName + " - " + "cyber•Fund" : "cyber•Fund";
  },
  function analyticsReport(context, redirect) {
    var options = {
      path: context.path,
      _url_: Meteor.absoluteUrl().slice(0, -1) + context.path
    };

    if (context.route.name == "Profile") {
      var user = Meteor.user();
      options.viewedSelf = (user && user.username) ?
        user.username == context.params.username : undefined;
    }

    analytics.page(context.route.name, options);
  }
]);


FlowRouter.route("/tracking", {
  name: "Tracking",
  triggersEnter: [
    function initPageLimit(context, redirect) {
      Session.set("ratingPageLimit", CF.Rating.limit1);
    }
  ],
  triggersExit: [
    function clearPageLimit(context, redirect) {
      Session.set("ratingPageLimit", 1);
    }
  ],
  action: function(params, queryParams) {
    BlazeLayout.render("layoutMain", {
      main: "tracking"
    });
  }
});


FlowRouter.route("/system/:name_", {
  name: "System",
  template: "systemBasic",
  triggersEnter: [
    function setTitle(context, redirect) {
      //var routeName = context.route.name;
      var name = context.params.name_.replace(/_/g, " ");
      document.title = name + " - " + "cyber•Fund";
    }
  ],
  action: function(params, queryParams) {
    BlazeLayout.render("layoutMain", {
      main: "systemBasic"
    });
  }
});

FlowRouter.route("/@:username", {
/*  subscriptions: function(params, queryParams) {
    var uid = CF.User.idByUsername(params.username);
    this.register('userProfile', Meteor.subscribe('userProfile', {username: params.username}));
    this.register('friendlyUsers', Meteor.subscribe('friendlyUsers', {username: params.username}));
    this.register('systems', Meteor.subscribe('portfolioSystems', {username: params.username}));
  },*/
  name: "Profile",
  action: function(params, queryParams) {
    BlazeLayout.render("layoutMain", {
      main: "profile"
    });
  },
  triggersEnter: [

    function setTitle(context, redirect) {
      var username = context.params.username;
      var user = CF.User.findOneByUsername(username);
      var name = user && user.profile && user.profile.name || username;
      //document.title = CF.User.isSelf ? 'Profile - cyber•Fund': name + ' at ' + 'cyber•Fund';
      document.title = name + " at " + "cyber•Fund";
    },

    function setCurrentUserSessions(context, redirect) {
      var username = context.params.username;
      if (Meteor.isClient) {
        CF.Profile.currentUsername.set(username);

        var uid = CF.User.findOneByUsername(username);
      }
    }
  ],
  triggersExit: [
    function resetCurrentUserSessions() {
      var uid = Meteor.userId();
      if (uid) {
        if (Meteor.isClient) {
          CF.Profile.currentUsername.set(CF.User.username());
        }
      }
    }
  ]
});

FlowRouter.route("/profile", {
  triggersEnter: [redirectLoggedToProfile, redirectGuestToWelcome]
});

FlowRouter.route("/welcome", {
  layoutTemplate: "layoutFullWidth",
  name: "Welcome",
  action: function(params, queryParams) {
    BlazeLayout.render("layoutFullWidth", {
      main: "welcome"
    });
  },
  triggersEnter: [redirectLoggedToProfile]
});

FlowRouter.route("/cyberep", {
  name: "Cyberep",
  action: function(params, queryParams) {
    BlazeLayout.render("layoutMain", {
      main: "cyberepPage"
    });
  }
});

FlowRouter.route("/accounts", {
  name: "Accounts",
  action: function(params, queryParams) {
    BlazeLayout.render("layoutMain", {
      main: "accounts"
    });
  }
});

FlowRouter.route("/invest", {
  name: "Invest",
  action: function(params, queryParams) {
    BlazeLayout.render("layoutMain", {
      main: "invest"
    });
  }
});

FlowRouter.route("/listing", {
  name: "Listing",
  action: function(params, queryParams) {
    BlazeLayout.render("layoutMain", {
      main: "listing"
    });
  }
});

FlowRouter.route("/main", {
  name: "Main",
  action: function(params, queryParams) {
    BlazeLayout.render("layoutMain", {
      main: "main"
    });
  }
});

FlowRouter.route("/decisions", {
  name: "Decisions",
  action: function(params, queryParams) {
    BlazeLayout.render("layoutMain", {
      main: "decisions"
    });
  }
});

FlowRouter.route("/invest", {
  name: "Invest",
  action: function(params, queryParams) {
    BlazeLayout.render("layoutMain", {
      main: "invest"
    });
  }
});


// todo move to triggers
var sorters = {
  "metrics.supplyChangePercents.day": {
    "inflation": -1,
    "deflation": 1
  },
  "metrics.turnover": {
    "active": -1,
    "passive": 1
  },
  "calculatable.RATING.vector.GR.monthlyGrowthD": {
    "profit": -1,
    "loss": 1
  },
  "calculatable.RATING.vector.GR.months": {
    "mature": -1,
    "young": 1
  },
  "metrics.cap.btc": {
    "whales": -1,
    "dolphins": 1
  },
  "metrics.cap.usd": {
    "whales": -1,
    "dolphins": 1
  },
  "metrics.capChangePercents.day.usd": {
    "bulls": -1,
    "bears": 1
  },
  "calculatable.RATING.vector.LV.num": {
    "love": -1,
    "hate": 1
  },
  "calculatable.RATING.sum": {
    "leaders": -1,
    "suckers": 1
  }
};

CF.Rating = CF.Rating || {};
CF.Rating.getKeyBySorter =  function getKeyBySorter(sorterobj){
  var ret = null;
  var key = _.keys(sorterobj).length && _.keys(sorterobj)[0];
  if (!key) return ret;
  var value = sorterobj[key];
  var obj = sorters[key];
  if (!obj) return ret;
  _.each(obj, function(v, k){
    if (v == value) ret = k;
  });
  return ret;
}

CF.Rating.getSorterByKey = function getSorterByKey(key){
  var ret = {};
  _.each(sorters, function(sorter, sorterKey){
    _.each(sorter, function(v, k){
      if (k == key) ret[sorterKey] = v;
    });
  });
  return ret;
}

var getSorterByKey = CF.Rating.getSorterByKey;
var getKeyBySorter = CF.Rating.getKeyBySorter;

FlowRouter.route("/rating", {
  name: "rating",
  triggersEnter: [
    function (context, redirect){
      var key = getKeyBySorter(_Session.get("coinSorter"));
        redirect("/rating/:sort", {sort: key || 'whales'});
    }
  ],
  triggersExit: [
  ],
});

FlowRouter.route("/rating/:sort", {
  name: "Rating",
  triggersEnter: [
    function () {

    }
  ],
  triggersExit: [
  ],
  action: function(params, queryParams) {
    BlazeLayout.render("layoutMain", {
      main: "ratingPage"
    });
  }
});

FlowRouter.route("/radar", {
  name: "Radar",
  action: function(params, queryParams) {
    BlazeLayout.render("layoutMain", {
      main: "radarPage"
    });
  }
});

FlowRouter.route("/", {
  name: "Index",
  action: function(params, queryParams) {
    BlazeLayout.render("layoutMain", {
      main: "main"
    });
  }
});
