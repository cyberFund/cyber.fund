//FlowRouter.triggers.enter([cb1, cb2]);
//FlowRouter.triggers.exit([cb1, cb2]);

// filtering
//FlowRouter.triggers.enter([trackRouteEntry], {only: ["home"]});
//FlowRouter.triggers.exit([trackRouteExit], {except: ["home"]});

function redirectLoggedToProfile(context, redirect) {
  if (Meteor.user()) {
    redirect('/@:twid', {twid: CF.User.twid()});
  }
}

function redirectGuestToWelcome(context, redirect) {
  if (!Meteor.user()) {
    redirect('/welcome');
  }
}

FlowRouter.triggers.enter([
  function flashOnLoad(context, redirect) {
    $('html, body').animate({
      scrollTop: 0
    }, 400);

    $('#main').hide().fadeIn(500);
    var $nav = $('#navicon');
    if ($nav && $nav.hasClass('open')) {
      $('body').animate({left: "0px"}, 200).css({"overflow": "scroll"});
      $('#main-nav').animate({right: "-250px"}, 200);
      $nav.removeClass('open').addClass('closed').html('&#9776; MENU');
      $('.fade').fadeOut();
    }
  },

  function analyticsReport(context, redirect) {
    analytics.page(context.route.name, {
      path: context.path
    });
  },
  function setTitle(context, redirect) {
    var routeName = context.route.name;
    document.title = routeName ? routeName + ' - ' + 'cyber•Fund' : 'cyber•Fund'
  }
]);

FlowRouter.route('/', {
    name: 'Index',
    triggersEnter: [
      function initPageLimit(context, redirect) {
        Session.set("ratingPageLimit", CF.Rating.limit0);
      }
    ],
    triggersExit: [
      function clearPageLimit(context, redirect) {
        Session.set("ratingPageLimit", 1);
      }
    ],
    action: function (params, queryParams) {
      BlazeLayout.render('layoutMain', {main: 'indexPage'})
    },
    fastRender: true
  }
);

FlowRouter.route('/rating', {
    name: 'Rating',
    triggersEnter: [
      function initPageLimit(context, redirect) {
        Session.set("ratingPageLimit", CF.Rating.limit0);
      }
    ],
    triggersExit: [
      function clearPageLimit(context, redirect) {
        Session.set("ratingPageLimit", 1);
      }
    ],
    action: function (params, queryParams) {
      BlazeLayout.render('layoutMain', {main: 'ratingPage'})
    },
    fastRender: true
  }
);

FlowRouter.route("/system/:name_", {
  name: "System",
  template: "systemBasic",
  triggersEnter: [
    function setTitle(context, redirect) {
      //var routeName = context.route.name;
      var name = context.params.name_.replace(/_/g, ' ');
      document.title = name + ' - ' + 'cyber•Fund';
    }
  ],
  action: function (params, queryParams) {
    BlazeLayout.render('layoutMain', {main: 'systemBasic'})
  },
  fastRender: true
});

FlowRouter.route("/@:twid", {
  name: 'Profile',
  action: function (params, queryParams) {
    BlazeLayout.render('layoutMain', {main: 'profile'})
  },
  triggersEnter: [
    function setCurrentUserSessions(context, redirect) {
      var twid = context.params.twid;
      if (Meteor.isClient) {
        CF.Profile.currentTwid.set(twid);

        var uid = Meteor.users.findOneByTwid(twid);
      }
    }
  ],
  triggersExit: [
    function resetCurrentUserSessions() {
      var uid = Meteor.userId();
      if (uid) {
        if (Meteor.isClient) {
          CF.Profile.currentTwid.set(CF.User.twid());
        }
      }
    }
  ]
});

FlowRouter.route("/portfolio", {
  name: "Portfolio",
  triggersEnter: [function (context, redirect) {
    var uid = Meteor.userId();
    if (uid) {
      if (Meteor.isClient) {
        CF.Profile.currentTwid.set(CF.User.twid());
      }
    }
    else {
      //this.redirect("Rating");
      FlowRouter.go("/welcome");
    }
  }],
  action: function (params, queryParams) {
    BlazeLayout.render('layoutMain', {main: 'portfolioPage'})
  },
  fastRender: true

});

FlowRouter.route("/radar", {
  name: "Radar",
  action: function (params, queryParams) {
    BlazeLayout.render('layoutMain', {main: 'radarPage'})
  },
  fastRender: true

});

FlowRouter.route("/welcome", {
  layoutTemplate: 'layoutFullWidth',
  name: "Welcome",
  action: function (params, queryParams) {
    BlazeLayout.render('layoutFullWidth', {main: 'welcome'})
  },
  triggersEnter: [redirectLoggedToProfile]
});

FlowRouter.route("/cyberep", {
  name: "Cyberep",
  action: function (params, queryParams) {
    BlazeLayout.render('layoutMain', {main: 'cyberepPage'})
  }
});

FlowRouter.route("/accounts", {
  name: "Accounts",
  action: function (params, queryParams) {
    BlazeLayout.render('layoutMain', {main: 'accounts'})
  }
});

FlowRouter.route("/invest", {
  name: "Invest",
  action: function (params, queryParams) {
    BlazeLayout.render('layoutMain', {main: 'invest'})
  }
});

FlowRouter.route("/decisions", {
  name: "Decisions",
  action: function (params, queryParams) {
    BlazeLayout.render('layoutMain', {main: 'decisions'})
  }
});

FlowRouter.route("/invest", {
  name: "Invest",
  action: function (params, queryParams) {
    BlazeLayout.render('layoutMain', {main: 'invest'})
  },
  fastRender: true
});
