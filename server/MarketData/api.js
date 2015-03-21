Meteor.startup(function() {

	Router.route( "/api/timestamp/:timestamp", { where: "server" })
		.get(function() {

			this.response.writeHead( 200, { "Content-Type": "application/json" });

			var data = MarketData.findOne({
				timestamp: +this.params.timestamp
			});

			this.response.end( JSON.stringify( data ));

		});

});
