Meteor.publish("current-data", function(offset, limit) {

	var latestTimestamp = MarketData.findOne({}, {
		sort: { timestamp: -1 },
		fields: { timestamp: 1 },
	}).timestamp;

	return MarketData.find(
		{ timestamp: latestTimestamp },
		{
			sort: { timestamp: -1 },
			limit: limit ? limit : 10,
			offset: offset ? offset : 0
		}
	);

});
