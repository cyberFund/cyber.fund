Package.describe({
  name: 'cyberfund:cyberfund-es',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
  "elasticsearch": "10.1.2"//,
  //"request-promise": "^0.4.2"
});

Package.onUse(function(api) {
  api.use(['cyberfund:cyberfund-base', "underscore"]);
  api.versionsFrom('1.1.0.2');
  api.addFiles('cyberfund-es.js', 'server');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('cyberfund:cyberfund-es', "server");
  api.addFiles('cyberfund-es-tests.js');
});
