this.publications = {

	getCurrentDataCursor: function(options) {

		return MarketData.find(
			{ timestamp: this.getLatestTimestamp() },
			{ sort: { timestamp: -1 } }
		);

	},

};

Meteor.startup(function() {

	Meteor.publish("current-data", function(options) {
		return publications.getCurrentDataCursor(options);
	});

});
