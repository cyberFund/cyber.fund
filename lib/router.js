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
    Session.set("ratingPageSort", CF.Rating.sorter0 );
    this.next();
  },
  fastRender: true,
  onStop: function () {
    Session.set("ratingPageLimit", 1);
  },
  waitOn: function () {
    return [
      Meteor.subscribe("currentDataRP", {limit: 10, sort: CF.Rating.sorter0 })
    ]
  }
});

Router.map(function () {

  this.route("Portfolio", {
    path: "/portfolio",
    template: "portfolioPage",
    fastRender: true,

    onBeforeAction: function () {
      var uid = Meteor.userId();
      if (uid) {
        if (Meteor.isClient)
          CF.Profile.currentUid.set(uid);
      }
      else {
        //this.redirect("Rating");
        this.redirect("Welcome");
      }
      this.next();
    },
    waitOn: function(){
      return [
        Meteor.subscribe('portfolioUser')
      ]
    }
  });
  this.route("Radar", {
    path: "/radar",
    template: "radarPage",
    fastRender: true,
    onBeforeAction: function(){
      var uid = Meteor.userId();
      if (uid) {
        if (Meteor.isClient)
          CF.Profile.currentUid.set(uid);
      }
      else {
        //this.redirect("Rating");
        this.redirect("Welcome");
      }
      this.next();
    },
    waitOn: function () {
      return Meteor.subscribe('crowdsale');
    },
    data: function () {
      return {
        crowdsale: CurrentData.find(CF.Chaingear.selector.crowdsales)
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
    template: "invest"
  });
  this.route("Hello", {
    path: "/hello",
    template: "hello"
  });
  this.route("R2D2", {
    path: "/r2d2",
    template: "r2d2"
  });
  this.route("Welocome", {
    layoutTemplate: 'layoutFullWidth',
    path: "/welcome",
    template: "welcome"
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
      if (Meteor.isClient)
        CF.Profile.currentTwid.set(twid);
      var uid = Meteor.users.findOneByTwid(twid);
      if (uid) {
        uid = uid._id;
        if (Meteor.isClient)
          CF.Profile.currentUid.set(uid);
      }
      this.next();
    },
    waitOn: function () {
      var twid = this.params.twid;
      return [
        Meteor.subscribe('userProfileByTwid', twid)
      ]
    }
  })
});
