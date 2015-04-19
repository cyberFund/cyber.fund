Meteor.startup(function() {

	Router.route("/", function() {
		this.render("rating");
		analytics.page("Viewed Rating");
	});

});
