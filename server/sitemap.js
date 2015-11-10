sitemaps.add('/sitemap.xml', function() {
  var out = [],
    coins = CurrentData.find({}, {fields: {updatedAt:1, system:1}}).fetch();
  out.push({
    page: '',
    changefreq: 'hourly'
  });
  _.each(coins, function(coin) {
    out.push({
      page: 'system/' + coin.system.replace(/\ /g, "_"),
      lastmod: coin.updatedAt
    });
  });
  console.log(out.length);
  return out;
});