Template['cgLink'].rendered = function () {
  
};

Template['cgLink'].helpers({
  /**
   * returns specifically fa-icon class
   */
  "iconClass": function () {
    var link = this;
    if (link.type == "custom") {
      console.log(link);
      return ""
    }
    switch (link.icon) {
      case "twitter.png":
        return "twitter";
      case "reddit.png":
        return "reddit";
      case "github.png":
        return "github";
      case "blog.png":
        return "link";
      case "website.png":
        return "link";
      case "forum.png":
        return "link";
      case "explorer.png":
        return "link";
      case "whitepaper.png":
        return "link";
      case "paper.png":
        return "link";
      default:
        return "external-link"
    }
  }
});

Template['cgLink'].events({
});