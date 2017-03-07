Template['cgLinkCard'].helpers({
  "iconUrl": function () {
    /* dataset as of february
    {icon:"coindesk.png",
      name:"CoinDesk",
      tags:["News"],
      length:1,
      type:"custom",
      url:"http://www.coindesk.com/tag/ethereum/}
    */
    var link = this.data;
    if (link.icon) {
      return "https://static.cyber.fund/logos/" + link.icon;
    }
    return "";
  }
});
