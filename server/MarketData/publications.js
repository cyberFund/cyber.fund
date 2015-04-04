this.publications = {

	getCurrentDataCursor: function(options) {

		return MarketData.find(
			{ timestamp: processing.getNearestTimestamp() },
			{
				sort: { timestamp: -1 },
				limit: 10,
				offset: 0,
			}
		);

	},

};

Meteor.startup(function() {

	Meteor.publish("current-data", function(options) {
		return publications.getCurrentDataCursor(options);
	});

});
