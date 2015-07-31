Template['cgLinkCard'].rendered = function () {
  
};

Template['cgLinkCard'].helpers({
  "iconUrl": function () {

    var link = this;
    console.log(link.icon);
    if (link.icon) {
      return "https://raw.githubusercontent.com/cyberFund/chaingear/gh-pages/logos/" + link.icon;

//      "https://github.com/cyberFund/chaingear/blob/gh-pages/logos/" + link.icon;
    }

    return "";
  }
});

Template['cgLinkCard'].events({
  'click .bar': function (e, t) {
    
  }
});