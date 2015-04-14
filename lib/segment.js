Meteor.startup(function() {

	if (Meteor.isServer) {
		if ("SEGMENT_KEY" in process.env) {
			analytics.load(process.env.SEGMENT_KEY);
		} else {
			console.error("SEGMENT_KEY env variable does not exist!");
		}
	}

});
