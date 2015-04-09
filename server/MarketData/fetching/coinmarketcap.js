var sourceUrl = "http://coinmarketcap.northpole.ro/api/v5/all.json";
var fetchInterval = 5 * 60 * 1000;

this.fetching.coinMarketCap = {};

this.fetching.coinMarketCap.processData = function(data, callback) {
	var systems = data.markets;
	var fetchedTimestamp = data.timestamp;

	var dayAgoTimestamp = processing.getNearestTimestamp("CoinMarketCap",
		moment.unix(fetchedTimestamp).subtract(1, "days"));

	var weekAgoTimestamp = processing.getNearestTimestamp("CoinMarketCap",
		moment.unix(fetchedTimestamp).subtract(1, "weeks"));

	var monthAgoTimestamp = processing.getNearestTimestamp("CoinMarketCap",
		moment.unix(fetchedTimestamp).subtract(1, "months"));

	var processedData = systems.map(function(rawSystem) {
		var processedSystem = {
			name: rawSystem.name,
			symbol: rawSystem.symbol,
			source: "CoinMarketCap",
			timestamp: rawSystem.timestamp,
			metrics: _.omit(rawSystem, "position", "name", "symbol", "timestamp"),
		};

		processedSystem.metrics.tradeVolumeMedianDeviation = {
			day: processing.getMedianValue("CoinMarketCap",
				rawSystem, "metrics.volume24.btc", dayAgoTimestamp),
			week: processing.getMedianValue("CoinMarketCap",
				rawSystem, "metrics.volume24.btc", weekAgoTimestamp),
			month: processing.getMedianValue("CoinMarketCap",
				rawSystem, "metrics.volume24.btc", monthAgoTimestamp),
		};

		return processedSystem;
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
