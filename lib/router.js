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
    if($nav && $nav.hasClass('open')) {
      $('body').animate({left: "0px"}, 200).css({"overflow":"scroll"});
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
    template: "ratingPage",
    waitOn: function(){
      return Meteor.subscribe("current-data", {
        onReady: function(){
          Session.set("tableReadyToRender", true);
        }
      });
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
  this.route("blog", {
    path: "/blog",
    template: "blogPage"
  });
});
