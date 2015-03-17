Meteor.publish("timestamps", function() {
	return MarketData.find(
		{},
		{
			fields: { timestamp: 1 },
			sort: { timestamp: -1 }
		}
	)
});
