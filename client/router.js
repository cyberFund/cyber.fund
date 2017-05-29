import {Meteor} from 'meteor/meteor'
//FlowRouter.triggers.enter([cb1, cb2]);
//FlowRouter.triggers.exit([cb1, cb2]);

// filtering
//FlowRouter.triggers.enter([trackRouteEntry], {only: ["home"]});
//FlowRouter.triggers.exit([trackRouteExit], {except: ["home"]});


// this one redirects user to his profile.
// so far only twitter accounts are used
import userUtils from '/imports/api/utils/user'
import cfRating from '/imports/api/cf/rating'
import {_session} from '/imports/api/client/utils/base'


function redirectLoggedToProfile(context, redirect) {
  if (Meteor.user()) {
    redirect("/@:username", {
      username: userUtils.username()
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
      Session.set("ratingPageLimit", cfRating.limit1);
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


FlowRouter.route("/system/:name_/:extra", {
  name: "SystemExtended",
  triggersEnter: [
    function setTitle(context, redirect) {
      //var routeName = context.route.name;
      var name = context.params.name_.replace(/_/g, " ");
      document.title = name + " - " + context.params.extra + "(cyber•Fund)";
    }
  ],
  action: function(params, queryParams) {
    BlazeLayout.render("layoutMainExtended", {
      main: "systemBasic", extra: "systemExtra"
    });
  }
});

FlowRouter.route("/@:username", {
  name: "Profile",
  action: function(params, queryParams) {
    BlazeLayout.render("layoutMain", {
      main: "profile"
    });
  },
  triggersEnter: [

    function setTitle(context, redirect) {
      var username = context.params.username;
      var user = userUtils.findByUsername(username);
      var name = user && user.profile && user.profile.name || username;
      document.title = name + " at " + "cyber•Fund";
    },

    function setCurrentUserSessions(context, redirect) {
    }
  ],
  triggersExit: [
    function resetCurrentUserSessions() {
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

// if sorterobj is undefined (ie if no session value ) make it empty object

var getSorterByKey = cfRating.getSorterByKey;
var getKeyBySorter = cfRating.getKeyBySorter;

FlowRouter.route("/rating", {
  name: "rating",
  triggersEnter: [
    function (context, redirect){
        var key = getKeyBySorter(_session.get("coinSorter"));
        redirect("/rating/:sort", {sort: key || "whales"});
    }
  ],
  triggersExit: [
  ]
});

FlowRouter.route("/rating/:sort", {
  name: "Rating",
  action: function(params, queryParams) {
    BlazeLayout.render("layoutMain", {
      main: "ratingPage"
    });
  }
});

FlowRouter.route("/monthly/rating", {
  name: "rating",
  triggersEnter: [
    function (context, redirect){
        var key = getKeyBySorter(_session.get("coinSorter"));
        redirect("/monthly/rating/:sort", {sort: key || "whales"});
    }
  ]
});

FlowRouter.route("/monthly/rating/:sort", {
  name: "Rating",
  action: function(params, queryParams) {
    BlazeLayout.render("layoutMain", {
      main: "ratingPageMonthly"
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
    /*FlowRouter.go("/rating")*/
    BlazeLayout.render("layoutMain", {
      main: "main"
    });
  }
});

FlowRouter.route("/funds", {
  name: "Funds",
  action: function(params, queryParams) {
    BlazeLayout.render("layoutMain", {
      main: "funds"
    });
  }
});

FlowRouter.route("/dailyPrices", {
  name: "DailyPrices",
  action: function(params, queryParams) {
    BlazeLayout.render("layoutMain", {
      main: "dailyPrices"
    });
  }
})

FlowRouter.route("/test", {
  name: "DailyPrices_test",
  action: function(params, queryParams) {
    BlazeLayout.render("layoutMain", {
      main: "testPage"
    });
  }
})

FlowRouter.route("/debug", {
  name: "Debug",
  action: function(params, queryParams) {
    BlazeLayout.render("layoutDebug", {
      main: "debugPage",
      widgets: ["search"]
    });
  }
})
