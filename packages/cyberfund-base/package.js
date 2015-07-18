Package.describe({
  name: 'cyberfund:cyberfund-base',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

var c= "client", s= "server", cs = ["client", "server"];

Npm.depends({"crypto-balance":  "0.0.20"}); // # todo: move to separate package..

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use(["underscore"], cs);
  api.addFiles('cyberfund-base.js', cs);
  api.addFiles(['server/utils-server.js', 'server/check-balance.js'], s);
  api.export("CF");
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('cyberfund:cyberfund-base');
  api.addFiles('cyberfund-base-tests.js');
});
