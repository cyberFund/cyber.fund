this.processing = {

	_deref: function(obj, dotNotationString) {
		var i = 0;
		var parts = dotNotationString.split(".");
		while (obj && i < parts.length) {
			obj = obj[parts[i]];
			i += 1;
		}
		return obj;
	},

	getNearestDocument: function(source, nearestTo, system, field) {
		var getWithQuery = function(query) {

			var result;
			var options = {};

			if (field) {
				options.fields = {};
				options.fields[field] = 1;
				options.fields.timestamp = 1;
			}

			if (source) {
				query.source = source;
			}

			if (system) {
				query.name = system.name;
				query.symbol = system.symbol;
			}

			if ("timestamp" in query && "$gte" in query.timestamp) {
				options.sort = { timestamp: 1 };
			} else {
				options.sort = { timestamp: -1 };
			}

			result = MarketData.findOne(query, options);
			return result ? result : null;

		};

		var getLatest = function() {
			return getWithQuery({});
		};

		var withNearestTimestamp = function(one, two, nearestTo) {
			if (Math.abs(nearestTo - one.timestamp) <
				Math.abs(nearestTo - two.timestamp)) {
				return one;
			} else {
				return two;
			}
		};

		var getNearest = function() {
			var nearestBefore = getWithQuery({ timestamp: { $lt: nearestTo } });
			var nearestAfter = getWithQuery({ timestamp: { $gte: nearestTo } });

			if (nearestAfter && nearestBefore) {
				return withNearestTimestamp(nearestAfter, nearestBefore, nearestTo);
			} else {
				return nearestAfter ? nearestAfter : nearestBefore;
			}
		};

		var isInt = function(obj) {
			return typeof obj === "number" && (obj % 1) === 0;
		};

		var resultDocument;

		if (isInt(nearestTo)) {
			resultDocument = getNearest();
		} else {
			resultDocument = getLatest();
		}

		if (resultDocument && field) {
			return this._deref(resultDocument, field);
		} else {
			return resultDocument;
		}
	},

	getNearestTimestamp: function(source, nearestTo) {
		return this.getNearestDocument(source, nearestTo, null, "timestamp");
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

		return medianDocument ? this._deref(medianDocument, fieldName) : null;
	},

	_postprocessors: [],

	addPostprocessor: function(postprocessor) {
		this._postprocessors.push(postprocessor);
	},

	doPostprocessing: function(source, data) {
		this._postprocessors.forEach(function(postprocessor) {
			postprocessor(source, data);
		});
	},

};
