Meteor.publish("current-data", function() {
	return MarketData.find(
		{},
		{
			sort: { timestamp: -1 },
			limit: 10,
		}
	);
});
