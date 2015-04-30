Package.describe({
  summary: "Meteor Reactive Templating library",
  version: '2.1.2'
});

Package.onUse(function (api) {
  api.export(['Blaze', 'UI', 'Handlebars']);
  api.use('jquery'); // should be a weak dep, by having multiple "DOM backends"
  api.use('tracker');
  api.use('underscore'); // only the subset in microscore.js
  api.use('htmljs');
  api.imply('htmljs');
  api.use('observe-sequence');
  api.use('reactive-var');

  // client and server
  api.addFiles([
    'preamble.js',
    'exceptions.js',
    'view.js',
    'builtins.js',
    'lookup.js',
    'template.js',
    'backcompat.js'
  ], 'server');

  api.addFiles('blaze.js', 'client');
  api.export('Blaze', 'client');
});
