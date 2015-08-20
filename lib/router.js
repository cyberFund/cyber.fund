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

Router.map(function () {
  this.route("Rating", {
    path: "/",
    //loadingTemplate: "",
    template: "ratingPage",
    onRun: function () {
      Session.set("curDataSelector", {"ratings.rating_cyber": 2});
      var self = this;
      Meteor.call('currentDataCount', function (err, ret) {
        if (!err && ret) Session.set("curDataCount", ret);
      });
      this.next();
    },
    fastRender: true,
    onStop: function () {
      Session.set("curDataSelector", {"ratings.rating_cyber": 6});
    },
    waitOn: function () {
      return Meteor.subscribe("currentDataRP", {"ratings.rating_cyber": 5});
    }
  });
  this.route("Portfolio", {
    path: "/portfolio",
    template: "portfolioPage",
    fastRender: true
  });
  this.route("Radar", {
    path: "/radar",
    template: "radarPage",
    fastRender: true,
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
  this.route("Profile", {
    path: "/profile",
    template: "profile"
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

  this.route("system2", {
    path: "/system/:name_/:symbol",
    template: "systemBasic",
    onRun: function () {
      var self = this;
      var name_ = this.params.name_;
      var name = this.params.name_.replace(/_/g, " ");
      Meteor.call("countByCurrencyName", name, function (err, ret) {
        if (ret == 1) {
          self.redirect("System", {name_: name_});
          return;
        }
        if (ret == 0) {
          Router.current().router.go("Rating");
          return;
        }
        this.next();
      })
    },
    data: function () {
      var name = this.params.name_.replace(/_/g, " "),
        symbol = this.params.symbol;
      return {
        curData: CurrentData.find(CF.CurrentData.selectors.system_symbol(name, symbol))
      }
    },
    fastRender: true,
    waitOn: function () {
      var name = this.params.name_.replace(/_/g, " ");
      return [
        Meteor.subscribe('systemData', {name: name, symbol: this.params.symbol})
        //Meteor.subscribe('customMarketData', {"aliases.CurrencyName": name}, {limit: 20})
      ]
    }
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
  this.route("UserProfile", {
    path: "/user/:twid",
    template: "userProfile",
    data: function () {
      var twitterId = this.params.twid;
      return {
        userData: Meteor.users.find({"profile.twitterNane": twitterId})
      }
    },
    fastRender: true,
    waitOn: function () {
      var twid = this.params.twid;
      return [
        Meteor.subscribe('userProfilesByTwid', [twid])
      ]
    }
  })
});
