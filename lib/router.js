Router.onRun(function() {

  /*Meteor.call('_pageAnalytics', {
    path: location.path
  })*/
  analytics.page();
  this.next();

});

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
  this.route("rating", {
    path: "/",
    //loadingTemplate: "",
    template: "ratingPage",
    onRun: function () {
      Session.set("curDataSelector", {rating: 2});
      var self = this;
      Meteor.call('currentDataCount', function(err, ret){
        if (!err && ret) Session.set("curDataCount", ret);
      });
      this.next();
    },
    onStop: function(){
      Session.set("curDataSelector", {rating: 5});
    },
    waitOn: function () {
      return Meteor.subscribe("current-data", {rating: 2});
    }
  });
  this.route("Portfolio", {
    path: "/portfolio",
    template: "portfolioPage"
  });
  this.route("Radar", {
    path: "/radar",
    template: "radarPage"
  });
  this.route("Cyberep", {
    path: "/cyberep",
    template: "cyberepPage"
  });
  this.route("Accounts", {
    path: "/accounts",
    template: "accounts"
  });
  this.route("System", {
    path: "/system",
    template: "system"
  });
  this.route("Profile", {
    path: "/profile",
    template: "profile"
  });
  this.route("Hello", {
    path: "/hello",
    template: "hello"
  });
  this.route("R2D2", {
    path: "/r2d2",
    template: "r2d2"
  });

  this.route("system", {
    path: "/system/:name_",
    template: "systemBasic",
    waitOn: function(){
      var name = Blaze._globalHelpers._toS(this.params.name_);
      return [
        Meteor.subscribe('customCurrentData', {"name": name}),
        Meteor.subscribe('customMarketData', {"aliases.CurrencyName": name})
      ]
    }
  })
});
