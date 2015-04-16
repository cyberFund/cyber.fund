Meteor.startup(function() {

	Meteor.call("getSegmentKey", function(error, segmentKey) {
		console.log("loaded segmentKey", segmentKey);
		if (segmentKey) {
			analytics.load(segmentKey);
		}
	});

});
