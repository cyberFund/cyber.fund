Template['cgLinkCard'].helpers({
  "iconUrl": function () {

    var link = this;
    if (link.icon) {
      return "https://raw.githubusercontent.com/cyberFund/chaingear/gh-pages/logos/" + link.icon;
    }

    return "";
  }
});
