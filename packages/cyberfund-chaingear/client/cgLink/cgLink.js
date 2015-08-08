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

    if (link.type == "github") return "github";

    switch (link.icon) {
      case "wiki.png":
        return "wikipedia-w";
      case "twitter.png":
        return "twitter";
      case "Wallet.png":
        return "credit-card";
      case "reddit.png":
        return "reddit";
      case "github.png":
        return "github";
      case "blog.png":
        return "pencil-square-o";
      case "website.png":
        return "home";
      case "forum.png":
        return "comments-o";
      case "explorer.png":
        return "search";
      case "whitepaper.png":
        return "mortar-board";
      case "paper.png":
        return "graduation-cap";
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