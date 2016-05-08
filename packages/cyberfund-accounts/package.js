Package.describe({
  name: 'cyberfund:cyberfund-accounts',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  api.use(["cyberfund:cyberfund-currentdata"]);
  api.use(['underscore'], ['client', 'server']);
  api.use(['ui', 'templating'], 'client');
  api.addFiles(['cyberfund-userassets.js', 'accounts.js'], ['client', 'server']);
  api.addFiles(['server/cyberfund-userassets-methods.js', 'server/cyberfund-userassets-pub.js',
  'server/accounts-server.js'], 'server');
  api.addFiles(['client/userassets.js', 'client/accounts-client.js',
    'client/assetsManager.html', 'client/assetsManager.js',
    'client/addAccount.html', 'client/addAccount.js',
    'client/displayAccount.html', 'client/displayAccount.js',
    'client/systemWithToken.html'
  ], 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('cyberfund-userassets');
  api.addFiles('cyberfund-userassets-tests.js');
});
