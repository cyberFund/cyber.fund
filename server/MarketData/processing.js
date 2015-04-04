this.processing = {

	getNearestTimestamp: function(source, nearestTo) {

		var query, nearestAfter, nearestBefore;

		if (source) {
			query = { source: source };
		} else {
			query = {};
		}

		if (nearestTo) {

			query.timestamp = { $lt: nearestTo };
			nearestBefore = MarketData.findOne(query, {
				sort: { timestamp: -1 },
				fields: { timestamp: 1 },
			}).timestamp;

			query.timestamp = { $gte: nearestTo };
			nearestAfter = MarketData.findOne(query, {
				sort: { timestamp: 1 },
				fields: { timestamp: 1 },
			}).timestamp;

			return Math.max(nearestBefore, nearestAfter);

		} else {

			return MarketData.findOne(query, {
				sort: { timestamp: -1 },
				fields: { timestamp: 1 },
			}).timestamp;

		}

	},

};
