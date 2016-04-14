Template['cgLinkCard'].helpers({
  "iconUrl": function () {

    var link = this;
    if (link.icon) {
      return "http://static.cyber.fund/logos/" + link.icon;
    }

    return "";
  }
});
