Meteor.startup(function() {
	Meteor.publish("current-data", function() {
		return CurrentData.find({}, { sort: { "cap.btc": -1 } });
	});
});
