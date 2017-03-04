Template['cgLinkCard'].helpers({
  "iconUrl": function () {
    console.log("--- iconurl.this")
    console.log(this)
    // aliases
    // metrics
    // token
    console.log("...")

    var link = this;
    if (link.icon) {
      return "https://static.cyber.fund/logos/" + link.icon;
    }
    return "";
  }
});
