Meteor.startup(function() {

	Router.route("/", function() {
		analytics.page("Rating Table");
		this.render("rating");
	});

});
