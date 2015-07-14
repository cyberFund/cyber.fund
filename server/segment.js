Meteor.startup(function() {

	var SEGMENT_KEY = null;

	if ("SEGMENT_KEY" in process.env) {
		SEGMENT_KEY = process.env.SEGMENT_KEY;
		//analytics.load(process.env.SEGMENT_KEY);
	} else {
		console.error("SEGMENT_KEY env variable does not exist!");
	}

	Meteor.methods({
		getSegmentKey: function() {
			return SEGMENT_KEY;
		}
	});

}); //obsolete, not needed.


/*
Accounts.onCreateUser(function(options, user) {
	analytics.alias(Meteor.userId());
	if (options.profile)
		user.profile = options.profile;
	return user;
});
*/

