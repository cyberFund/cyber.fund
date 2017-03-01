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

Npm.depends({"crypto-balance":  "0.0.20"});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use(["underscore", "accounts-base", "d3js:d3"], cs);
  api.use(["templating"], c);

  api.export("CF");

});
