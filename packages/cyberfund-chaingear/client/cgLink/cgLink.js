Template['cgLink'].rendered = function () {
  
};

Template['cgLink'].helpers({
  /**
   * returns specifically fa-icon class
   */
  "iconClass": function () {
    var link = this;
    switch (link.icon) {
      case "twitter.png":
        return "fa-twitter";
      default:
        return ""
    }
    return "";
  }
});

Template['cgLink'].events({
});