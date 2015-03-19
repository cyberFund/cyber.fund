Router.route("/", function() {
	this.render("home");
});

Meteor.AppCache.config({
	onlineOnly: ['/bower_components/']
});
