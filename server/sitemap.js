sitemaps.add('/sitemap.xml', function () {
  var ret = [];
  ret.push({
    page: '',
    changefreq: 'hourly'
  });

  ret.push({
    page: 'radar',
    changefreq: 'weekly'
  });

  CurrentData.find({}, {fields: {updatedAt: 1}})
    .forEach(function (coin) {
      ret.push({
        page: 'system/' + coin._id.replace(/\ /g, "_"),
        lastmod: coin.updatedAt
      });
    });
  Meteor.users.find({}, {fields: {"profile.twitterName": 1}})
    .forEach(function(user){
      if (user.profile && user.profile.twitterName)
      ret.push({
        page: '@' + user.profile.twitterName
      });
    });
  return ret;
});
