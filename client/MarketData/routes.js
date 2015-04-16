Meteor.startup(function() {

	Router.route("/", function() {
		this.render("home");
		analytics.page("Rating Table");
	});

});
