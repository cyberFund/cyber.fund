Meteor.startup(function() {

	processing.addPostprocessor(function(source, data) {
		analytics.track({
			userId: "server",
			event: "Data Fetched",
			properties: {
				source: source,
				documentCount: data.length,
			},
		});
	});

});
