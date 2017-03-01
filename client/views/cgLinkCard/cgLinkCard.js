Template['cgLinkCard'].helpers({
  "iconUrl": function () {

    var link = this;
    if (link.icon) {
      return "https://static.cyber.fund/logos/" + link.icon;
    }

    return "";
  }
});
