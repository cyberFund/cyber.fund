Template['cgLinkCard'].helpers({
  "iconUrl": function () {
    console.log(this)
    var link = this;
    if (link.icon) {
      return "https://static.cyber.fund/logos/" + link.icon;
    }

    return "";
  }
});
