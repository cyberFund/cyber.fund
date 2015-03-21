Meteor.startup(function() {

	Meteor.AppCache.config({
		onlineOnly: ['/bower_components/']
	});

});
