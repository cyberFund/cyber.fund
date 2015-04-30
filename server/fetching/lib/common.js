this.fetching = {};

this.fetching.get = function(url, options, callback) {
	HTTP.get(url, options, function(error, result) {
		var parsedData, errorMessage;

		try {
			parsedData = result.data || JSON.parse(result.content);
		} catch(e) {}

		if (error) {
			callback(error);
		} else if (!parsedData) {
			errorMessage = "Cannot parse new data!";
			if (result.content) {
				errorMessage += " Content (first 100 symbols): " +
					result.content.substring(0, 100);
			}
			callback(new Error(errorMessage));
		} else {
			callback(null, parsedData);
		}
	});
};

this.fetching.getCollection = function() {
	return MarketData;
};

this.fetching.saveToDb = function(data, callback) {
	this.getCollection().rawCollection().insert(data, function(error, result) {
		if (error) {
			callback(error);
		} else {
			callback(null, true);
		}
	});
};
