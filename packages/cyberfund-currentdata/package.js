Package.describe({
  name: "cyberfund:cyberfund-currentdata",
  version: "0.0.1",
  // Brief, one-line summary of the package.
  summary: "",
  // URL to the Git repository containing the source code for this package.
  git: "",
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: "README.md"
});

Package.onUse(function(api) {
  api.use("cyberfund:cyberfund-base");
  api.imply("cyberfund:cyberfund-base");
  api.use(["coffeescript", "underscore"]);
  api.use(["templating"], "client");
  api.versionsFrom("1.1.0.2");
  api.addFiles("cyberfund-currentdata.js");
  api.addFiles(["server/calculatables.coffee"], "server");
  api.addFiles(["client/helpers.js"], "client");
});

Package.onTest(function(api) {
  api.use("tinytest");
  api.use("cyberfund:cyberfund-currentdata");
  api.addFiles("cyberfund-currentdata-tests.js");
});
