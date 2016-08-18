import React from 'react'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { mount } from 'react-mounter'

import MainLayout from '../ui/pages/layouts/MainLayout'
import IndexPageContainer from '../ui/containers/IndexPageContainer'
import WelcomePage from '../ui/pages/WelcomePage'
import LoginPage from '../ui/pages/LoginPage'
import ProfilePageContainer from '../ui/containers/ProfilePageContainer'
import RadarPageContainer from '../ui/containers/RadarPageContainer'
import SystemPageContainer from '../ui/containers/SystemPageContainer'
import ListingPage from '../ui/pages/ListingPage'
import RatingPage from '../ui/pages/RatingPage'
import FundsPageContainer from '../ui/containers/FundsPageContainer'
import DecisionsPage from '../ui/pages/DecisionsPage'

//TODO: refactor routes as done below
/*[
  ['/', 'Index', <IndexPageContainer />],
  ['/welcome', 'Welcome', <WelcomePage />],
  ['/sign-in', 'SignIn', <LoginPage />],
  ['/radar', 'Radar', <RadarPageContainer />],
  ['/rating', 'Rating', <RatingPage />],
  ['/funds', 'Funds', <FundsPageContainer />]
].forEach( item =>{
    FlowRouter.route(item[0], {
        name: item[1]
        action() {
            mount(MainLayout, {
              main: item[2]
            })
        }
    })
  })
*/
FlowRouter.notFound = {
    action: function() {
      console.warn('Route not found! Redirecting to index page')
      mount(MainLayout, {
        // TODO: create 404Page component
          main: <IndexPageContainer />
      })
    }
}
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


/*FlowRouter.route("/tracking", {
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
});*/


FlowRouter.route("/system/:name_", {
  name: "System",
  triggersEnter: [
    function setTitle(context, redirect) {
      //var routeName = context.route.name;
      var name = context.params.name_.replace(/_/g, " ");
      document.title = name + " - " + "cyber•Fund";
    }
  ],
  action: function(params, queryParams) {
      mount(MainLayout, {
        main: <SystemPageContainer />
      })
  }
});

FlowRouter.route("/@:username", {
  name: "Profile",
  action: function(params, queryParams) {
      mount(MainLayout, {
        main: <ProfilePageContainer />
      })
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
    }
  ],
  triggersExit: [
    function resetCurrentUserSessions() {
    }
  ]
});

FlowRouter.route("/sign-in", {
  name: "SignIn",
  action: function(params, queryParams) {
      mount(MainLayout, {
        main: <LoginPage />
      })
  },
  triggersEnter: [redirectLoggedToProfile]
});

FlowRouter.route("/profile", {
  triggersEnter: [redirectLoggedToProfile, redirectGuestToWelcome]
});

FlowRouter.route("/welcome", {
  name: "Welcome",
  action: function(params, queryParams) {
      mount(MainLayout, {
        main: <WelcomePage />
      })
  },
  triggersEnter: [redirectLoggedToProfile]
});

FlowRouter.route("/decisions", {
  name: "Decisions",
  action: function(params, queryParams) {
      mount(MainLayout, {
        main: <DecisionsPage />
      })
  }
});

FlowRouter.route("/listing", {
  name: "Listing",
  action() {
      mount(MainLayout, {
        main: <ListingPage />
      })
  }
});

/*
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

FlowRouter.route("/invest", {
  name: "Invest",
  action: function(params, queryParams) {
    BlazeLayout.render("layoutMain", {
      main: "invest"
    });
  }
});
*/

// TODO: move to triggers
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
// if sorterobj is undefined (ie if no session value ) make it empty object
CF.Rating.getKeyBySorter =  function getKeyBySorter( sorterobj = {} ){
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
};

CF.Rating.getSorterByKey = function getSorterByKey(key){
  var ret = {};
  _.each(sorters, function(sorter, sorterKey){
    _.each(sorter, function(v, k){
      if (k == key) ret[sorterKey] = v;
    });
  });
  return ret;
};

var getSorterByKey = CF.Rating.getSorterByKey;
var getKeyBySorter = CF.Rating.getKeyBySorter;

FlowRouter.route("/rating", {
  name: "rating",
  triggersEnter: [
    function (context, redirect){
      var key = getKeyBySorter(CF.Utils._session.get("coinSorter"));
      redirect("/rating/:sort", {sort: key || "whales"});
    }
  ],
  triggersExit: [
  ]
});

FlowRouter.route("/rating/:sort", {
  name: "Rating",
  action: function(params, queryParams) {
      mount(MainLayout, {
        main: <RatingPage />
      })
  }
});

/*FlowRouter.route("/monthly/rating", {
  name: "rating",
  triggersEnter: [
    function (context, redirect){
      var key = getKeyBySorter(CF.Utils._session.get("coinSorter"));
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
});*/

FlowRouter.route("/radar", {
  name: "Radar",
  action: function(params, queryParams) {
      mount(MainLayout, {
        main: <RadarPageContainer />
      })
  }
});

FlowRouter.route("/", {
  name: "Index",
  action: function(params, queryParams) {
      mount(MainLayout, {
        main: <IndexPageContainer />
      })
  }
});

FlowRouter.route("/funds", {
  name: "Funds",
  action: function(params, queryParams) {
      mount(MainLayout, {
        main: <FundsPageContainer />
      })
  }
});
