this.publications = {

	getLatestTimestamp: function() {

		return MarketData.findOne({}, {
			sort: { timestamp: -1 },
			fields: { timestamp: 1 },
		}).timestamp;

	},

	getCurrentDataCursor: function(options) {

		return MarketData.find(
			{ timestamp: this.getLatestTimestamp() },
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
