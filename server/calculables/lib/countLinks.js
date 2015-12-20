var tags = { // NB: mongo query: db.CurrentData.distinct("links.tags")
  "0" : "Main",
  "1" : "News",
  "2" : "Analytics",
  "3" : "Apps",
  "4" : "Code",
  "5" : "Explorer",
  "6" : "Exchange",
  "7" : "Wallet",
  "8" : "API",
  "9" : "Science",
  "10" : "paper",
  "11" : "Publications",
  "12" : "code",
  "13" : "publications",
  "14" : "wallet",
  "15" : "DAO"
};

var types = { // NB: mongo query: db.CurrentData.distinct("links.type")
  "0" : "paper",
  "1" : "twitter",
  "2" : "website",
  "3" : "explorer",
  "4" : "forum",
  "5" : "github",
  "6" : "code",
  "7" : "custom",
  "8" : "exchange",
  "9" : "reddit",
  "10" : "wallet",
  "11" : "blog",
  "12" : "wiki",
  "13" : "Forum",
  "14" : "site",
  "15" : "whitepaper",
  "16" : "facebook",
  "17" : "google+",
  "18" : "youtube",
  "19" : "protocol",
  "20" : "walllet",
  "21" : "BTT Thread",
  "22" : "bitbucket",
  "23" : "GitHub Organization",
  "24" : "News"
};

CF.CurrentData.calculatables.addCalculatable('nLinksWithTag', function(system) {

  if (!system) return undefined;

  var links = system.links;
  var ret = {};

  if (!links || !links.length) return undefined;
  _.each(tags, function(tag) {
    ret[tag] = CF.CurrentData.linksWithTag(links, tag).length;
  });
  return ret;
});

CF.CurrentData.calculatables.addCalculatable('nLinksWithType', function(system) {
  if (!system) return undefined;

  var links = system.links;
  var ret = {};

  if (!links || !links.length) return undefined;
  _.each(types, function(type) {
    ret[type] = CF.CurrentData.linksWithType(links, type).length;
  });
  return ret;
});
