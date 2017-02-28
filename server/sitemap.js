import {CurrentData} from '/imports/api/collections'
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
  Meteor.users.find({}, {fields: {"username": 1}})
    .forEach(function(user){
      if (user.username)
      ret.push({
        page: '@' + user.username
      });
    });
  return ret;
});
