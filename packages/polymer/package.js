Package.describe({
	name: 'polymer',
	version: '0.1.0',
	summary: 'Add head and body tags, ignore everyting else.',
	documentation: null
});

Package.onUse(function (api) {
	api.use('tracker', 'client');
	api.addFiles('polymer.js', 'client');
});

Package.registerBuildPlugin({
	name: 'vulcanize',
	use: ['random'],
	npmDependencies: {
		'vulcanize': '0.7.9'
	},
	sources: [
		'vulcanize.js',
		'html_scanner.js'
	]
});
