Template['cgLink'].rendered = function () {
  
};

Template['cgLink'].helpers({
  /**
   * returns specifically fa-icon class
   */

  "iconUrl": function () {
    var link = this;
    //if (link.icon)
      //return "https://github.com/cyberFund/chaingear/blob/gh-pages/logos/" + link.icon;
    switch (link.icon) {
      case "twitter.png":
        return "twitter";
      case "reddit.png":
        return "reddit";
      case "github.png":
        return "github";
      case "blog.png":
        return "comment";
      case "website.png":
        return "home";
      case "forum.png":
        return "comments";
      case "explorer.png":
        return "search";
      case "whitepaper.png":
        return "mortar-board";
      case "paper.png":
        return "newspaper-o";
      default:
        break;
    }
    if (link.type == "custom") {
      //console.log(link);
      return ""
    }
    return "external-link";
  }
})
;

Template['cgLink'].events({});