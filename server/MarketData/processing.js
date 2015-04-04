this.processing = {

	getNearestTimestamp: function(source, nearestTo) {

		var query, nearestAfter, nearestBefore;

		var getWithQuery = function(query) {

			var result;
			var options = { fields: { timestamp: 1 } };

			if (source) {
				query.source = source;
			}

			if ("timestamp" in query && "$gte" in query.timestamp) {
				options.sort = { timestamp: 1 };
			} else {
				options.sort = { timestamp: -1 };
			}

			result = MarketData.findOne(query, options);
			return result ? result.timestamp : null;

		};

		if (typeof nearestTo === "number" && (nearestTo % 1) === 0) {

			nearestBefore = getWithQuery({ timestamp: { $lt: nearestTo } });
			nearestAfter = getWithQuery({ timestamp: { $gte: nearestTo } });

			if (nearestAfter && nearestBefore) {
				return Math.max(nearestBefore, nearestAfter);
			} else if (nearestAfter) {
				return nearestAfter;
			} else {
				return nearestBefore;
			}

		} else {

			return getWithQuery({});

		}

	},

};
