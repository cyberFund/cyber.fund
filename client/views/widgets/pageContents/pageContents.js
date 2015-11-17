Template['pageContents'].rendered = function () {
  
};

Template['pageContents'].helpers({
  'foo': function () {
    
  }
});

Template['pageContents'].events({
  'click .scroller > li > a': function (e, t) {

    var href = $(e.currentTarget).attr("href");

    if (href.indexOf("#") > -1) { //#hash link at all

      href = href.split("#");
      var path = FlowRouter.getPath();
      if (!href[0] || (href[0] == path)) { // #hash link at localpage
        var body = $("html, body");
        var elem = $("#" + href[1]);
        body.animate({scrollTop: elem.offset().top}, '350', 'swing', function () {
        });
        return false;
      }
    }
  }
});