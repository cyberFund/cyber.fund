var sourceUrl = "http://coinmarketcap.northpole.ro/api/v5/all.json";
var fetchInterval = 5 * 60 * 1000;

this.fetching.coinMarketCap = {};

this.fetching.coinMarketCap.processData = function(data, callback) {
	var systems = data.markets;
	var processedData = systems.map(function(system) {
		var metrics = _.omit(system, "position", "name", "symbol", "timestamp");
		return {
			name: system.name,
			symbol: system.symbol,
			timestamp: system.timestamp,
			source: "CoinMarketCap",
			metrics: metrics,
		};
	});
	callback(null, processedData);
};

Meteor.startup(function() {
	var fetch = function() {
		console.log("Fetching data from CoinMarketCap...");
		fetching.get(sourceUrl, { timeout: fetchInterval }, function(error, result) {
			if (error) {
				console.error("Error while fetching:", error);
				return;
			}

			fetching.coinMarketCap.processData(result, function(error, result) {
				if (error) {
					console.error("Error while processing:", error);
					return;
				}

				fetching.saveToDb(result, function(error, result) {
					if (error) {
						console.error("Error while saving:", error);
						return;
					}

					console.log("Saved!");
				});
			});
		});
	};

	Meteor.setInterval(fetch, fetchInterval);
	fetch();
});
