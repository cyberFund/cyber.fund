this.fetching = {};

this.fetching.get = function(url, options, callback) {
	HTTP.get(url, options, function(error, result) {
		if (error) {
			callback(error);
		} else if (!result.data) {
			callback(new Error("Cannot parse new data!"));
		} else {
			callback(null, result.data);
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
