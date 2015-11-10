Router.configure({
  layoutTemplate: 'layoutMain',
  loadingTemplate: 'loading',
  load: function () {
    $('html, body').animate({
      scrollTop: 0
    }, 400);
    $("body").scrollTop(0);
    $('#main').hide().fadeIn(500);
    var $nav = $('#navicon');
    if ($nav && $nav.hasClass('open')) {
      $('body').animate({left: "0px"}, 200).css({"overflow": "scroll"});
      $('#main-nav').animate({right: "-250px"}, 200);
      $nav.removeClass('open').addClass('closed').html('&#9776; MENU');
      $('.fade').fadeOut();
    }
    this.next();
  }
});
Router.onBeforeAction('loading');

Router.route("Rating", {
  path: "/",
  template: "ratingPage",
  onRun: function () {
    Session.set("ratingPageLimit", CF.Rating.limit0);

    this.next();
  },
  fastRender: true,
  onStop: function () {
    Session.set("ratingPageLimit", 1);
  },
  waitOn: function () {
    return [
      Meteor.subscribe("currentDataRP", {limit: 10, sort: CF.Rating.sorter0})
    ]
  }
});

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

  this.route("Portfolio", {
    path: "/portfolio",
    template: "portfolioPage",
    fastRender: true,

    onBeforeAction: function () {
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
      this.next();
    },
    waitOn: function () {
      return [
        Meteor.subscribe('portfolioUser', Meteor.userId())
      ]
    }
  });
  this.route("Radar", {
    path: "/radar",
    template: "radarPage",
    fastRender: true,
    /*onBeforeAction: function () {
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
     this.next();
     },*/
    waitOn: function () {
      return Meteor.subscribe('crowdsale');
    },
    data: function () {
      return {
        crowdsale: CurrentData.find(CF.Chaingear.selector.crowdsales),
        crowdsalePast: CurrentData.find({
          $and: [CF.Chaingear.selector.crowdsales,
            {'crowdsales.end_date': {$lt: new Date()}}]
        }, {sort: {'crowdsales.end_date': -1}}),
        crowdsaleUpcoming: CurrentData.find({
          $and: [CF.Chaingear.selector.crowdsales,
            {'crowdsales.start_date': {$gt: new Date()}}]
        }),
        crowdsaleActive: CurrentData.find({
          $and: [CF.Chaingear.selector.crowdsales,
            {'crowdsales.end_date': {$gt: new Date()}},
            {'crowdsales.start_date': {$lt: new Date()}}]
        }),
        project: CurrentData.find(CF.Chaingear.selector.projects)
      }
    }
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
    waitOn: function () {
      return [
        Meteor.subscribe('investData')
      ]
    },
    data: function(){
      return {invest: Extras.findOne({_id: "invest_balance"}),
      cap: Extras.findOne({_id: "total_cap"})};
    },
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

  this.route("Profile", {
    path: "/@:twid",
    template: "profile",
    data: function () {
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
    }
  })
});
