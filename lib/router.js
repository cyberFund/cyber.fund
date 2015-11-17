//FlowRouter.triggers.enter([cb1, cb2]);
//FlowRouter.triggers.exit([cb1, cb2]);

// filtering
//FlowRouter.triggers.enter([trackRouteEntry], {only: ["home"]});
//FlowRouter.triggers.exit([trackRouteExit], {except: ["home"]});

FlowRouter.triggers.enter([
  function flashOnLoad(context, redirect) {
    $('html, body').animate({
      scrollTop: 0
    }, 400);
    //$("body").scrollTop(0);
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
    console.log(context);
    analytics.page(FlowRouter.getRouteName());
  },
  function setTitle(context, redirect) {
    var routeName =  context.route.name;
    document.title =  routeName ? routeName + ' - ' + 'cyber•Fund' : 'cyber•Fund'
  }
]);
FlowRouter.route('/', {
    name: 'rating',
    triggersEnter: [function(context, redirect){
      Session.set("ratingPageLimit", CF.Rating.limit0);
    }],
    action: function (params, queryParams) {
      BlazeLayout.render('layoutMain', {main: 'ratingPage'})
    }//,
    //fastRender: true,
    /*
     onStop: function () {
     Session.set("ratingPageLimit", 1);
     },
     waitOn: function () {
     return [
     Meteor.subscribe("currentDataRP", {limit: 10, sort: CF.Rating.sorter0})
     ]
     }
     */
  }
);

FlowRouter.route("/@:twid", {
  name: 'Profile',
  action: function(params, queryParams){
    BlazeLayout.render('layoutMain', {main: 'profile'})
  }
  /*data: function () {
    var twitterId = this.params.twid;
    return {
      userData: Meteor.users.find({"profile.twitterNane": twitterId})
    }
  },
  fastRender: true,
  onBeforeAction: function () {
    var twid = this.params.twid;
    if (Meteor.isClient) {
      CF.Profile.currentTwid.set(twid);

      var uid = Meteor.users.findOneByTwid(twid);
      if (uid) {
        uid = uid._id;
        if (Meteor.isClient) {
          CF.Profile.currentUid.set(uid);
        }
      }
    }
    this.next();
  },
  waitOn: function () {
    var twid = this.params.twid;
    return [
      Meteor.subscribe('userProfileByTwid', twid)
    ]
  },
  onStop: function () {
    var uid = Meteor.userId();
    if (uid) {
      if (Meteor.isClient) {
        CF.Profile.currentUid.set(uid);
        CF.Profile.currentTwid.set(CF.User.twid());
      }
    }
  }*/
});

FlowRouter.route("/portfolio", {
  name: "Portfolio",
  triggersEnter: [function(context, redirect){
    var uid = Meteor.userId();
    if (uid) {
      if (Meteor.isClient) {
        CF.Profile.currentUid.set(uid);
        CF.Profile.currentTwid.set(CF.User.twid());
      }
    }
    else {
      //this.redirect("Rating");
      Router.go("/welcome");
    }
  }],
  action: function(params, queryParams){
    BlazeLayout.render('layoutMain', {main: 'portfolioPage'})
  },
 // fastRender: true,

});
FlowRouter.route("/radar", {
  name: "Radar",
  action:  function(params, queryParams){
    BlazeLayout.render('layoutMain', {main: 'radarPage'})
  },
 // fastRender: true

});

/*
Router.map(function () {
  this.route("Welcome", {
    layoutTemplate: 'layoutFullWidth',
    path: "/welcome",
    onBeforeAction: function () {
      if (Meteor.user()) Router.go('/profile');
      this.next();
    },
    template: "welcome"
  });


  this.route("Cyberep", {
    path: "/cyberep",
    template: "cyberepPage"
  });
  this.route("Accounts", {
    path: "/accounts",
    template: "accounts"
  });
  this.route("Invest", {
    path: "/invest",
    template: "invest"
  });
  this.route("Decisions", {
    path: "/decisions",
    template: "decisions"
  });
  this.route("System", {
    path: "/system/:name_",
    template: "systemBasic",
    data: function () {
      var name = this.params.name_.replace(/_/g, " ");
      return {
        curData: CurrentData.find(CF.CurrentData.selectors.system(name))
      }
    },
    fastRender: true,
    waitOn: function () {
      var name = this.params.name_.replace(/_/g, " ");
      return [
        Meteor.subscribe('systemData', {name: name})
      ]
    }
  });

  this.route("Doc1", {
    path: "/serve/0",
    onBeforeAction: function () {
      Router.go("/cyberFund_Genesis_Agreement.pdf")
    }
  });

  this.route("ProfileOld", {
    path: "/profile",
    onBeforeAction: function () {
      var user = Meteor.user();
      if (!user) {
        this.redirect("/")
      }
      else {
        var twid = user.profile && user.profile.twitterName || '';
        this.redirect(twid ? "/@" + twid : '/');
      }
      this.next();
    }

  });


});
*/