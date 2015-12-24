Package.describe({
  name: 'cyberfund:cyberfund-marketdata',
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
  api.use('cyberfund:cyberfund-base');
  api.use('underscore');
  api.use(['templating'], 'client')
  api.versionsFrom('1.1.0.2');
  api.export("MarketData");
  api.addFiles('cyberfund-marketdata.js');
  api.addFiles('client/cf-marketdata-client.js', 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('cyberfund:cyberfund-marketdata');
  api.addFiles('cyberfund-marketdata-tests.js');
});
