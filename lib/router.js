Router.onRun(function() {
  //analytics.page();
  var location = Router.current().location.get();
  Meteor.call('_trackAnalytics',{
    event: "loaded page",
    properties: {
      path: location.path
    }
  });
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
  this.route("portfolio", {
    path: "/portfolio",
    template: "portfolioPage"
  });
  this.route("radar", {
    path: "/radar",
    template: "radarPage"
  });
  this.route("cyberep", {
    path: "/cyberep",
    template: "cyberepPage"
  });
  this.route("satoshiFund", {
    path: "/satoshiFund",

  });
  this.route("subscribe", {
    path: "/subscribe"
  });
});
