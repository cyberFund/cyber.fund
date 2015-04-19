Meteor.startup(function() {

	processing.addPostprocessor(function(source, timestamp, data) {
		analytics.track({
			userId: "server",
			event: "Fetched Data",
			properties: {
				source: source,
				timestamp: timestamp,
				documentCount: data.length,
			},
		});
	});

});
