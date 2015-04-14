Meteor.startup(function() {
	ReactiveTable.publish("current-data", CurrentData);
});
