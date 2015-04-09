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

	getMedianValue: function(source, system, fieldName, since) {
		var count = MarketData.find({
			name: system.name,
			symbol: system.symbol,
			source: source,
			timestamp: { $gte: since },
		}).count();

		var fieldNameEnabled = {};
		fieldNameEnabled[fieldName] = 1;

		var medianDocument = MarketData.findOne({
			name: system.name,
			symbol: system.symbol,
			source: source,
			timestamp: { $gte: since },
		}, {
			sort: fieldNameEnabled,
			skip: Math.floor(count / 2),
		});

		var deref = function(obj, dotNotationString) {
			var i = 0;
			var parts = dotNotationString.split(".");
			while (obj && i < parts.length) {
				obj = obj[parts[i]];
				i += 1;
			}
			return obj;
		};

		return medianDocument ? deref(medianDocument, fieldName) : null;
	},

};
