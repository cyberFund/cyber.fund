
CF.CurrentData.calculatables.addCalculatable('nLinksWithTag', function(system) {
  if (!system) return undefined;
  var tags = ['Apps', 'Code', 'Main', 'publications', 'News',
    'Science', 'Analytics', 'Exchange', 'Wallet', 'Publications',
    'Explorer', 'code', 'DAO', 'App', 'API', 'paper', 'wallet', 'Community'
  ];
  links = system.links,
    ret = {};
  if (!links || !links.length) return undefined;
  _.each(tags, function(tag) {
    ret[tag] = CF.CurrentData.linksWithTag(links, tag).length;
  });
  return ret;
})
