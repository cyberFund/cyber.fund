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

		var tradeVolumeMedianDeviation = {
			day: processing.getMedianValue("CoinMarketCap",
				rawSystem, "metrics.volume24.btc", dayAgoTimestamp),
			week: processing.getMedianValue("CoinMarketCap",
				rawSystem, "metrics.volume24.btc", weekAgoTimestamp),
			month: processing.getMedianValue("CoinMarketCap",
				rawSystem, "metrics.volume24.btc", monthAgoTimestamp),
		};

		processedSystem.metrics.tradeVolumeMedianDeviation = {
			day: tradeVolumeMedianDeviation.day ? tradeVolumeMedianDeviation.day : 0,
			week: tradeVolumeMedianDeviation.week ? tradeVolumeMedianDeviation.week : 0,
			month: tradeVolumeMedianDeviation.month ? tradeVolumeMedianDeviation.month : 0,
		};

		var supplyBefore = {
			day: processing.getNearestDocument("CoinMarketCap", dayAgoTimestamp,
				rawSystem, "metrics.availableSupplyNumber"),
			week: processing.getNearestDocument("CoinMarketCap", weekAgoTimestamp,
				rawSystem, "metrics.availableSupplyNumber"),
			month: processing.getNearestDocument("CoinMarketCap", monthAgoTimestamp,
				rawSystem, "metrics.availableSupplyNumber"),
		};

		processedSystem.metrics.supplyChange = {
			day: supplyBefore.day ?
				processedSystem.metrics.availableSupplyNumber - supplyBefore.day :
				0,
			week: supplyBefore.week ?
				processedSystem.metrics.availableSupplyNumber - supplyBefore.week :
				0,
			month: supplyBefore.month ?
				processedSystem.metrics.availableSupplyNumber - supplyBefore.month :
				0,
		};

		var capBefore = {
			day: processing.getNearestDocument("CoinMarketCap", dayAgoTimestamp,
				rawSystem, "metrics.marketCap"),
			week: processing.getNearestDocument("CoinMarketCap", weekAgoTimestamp,
				rawSystem, "metrics.marketCap"),
			month: processing.getNearestDocument("CoinMarketCap", monthAgoTimestamp,
				rawSystem, "metrics.marketCap"),
		};

		processedSystem.metrics.capChange = {
			day: {
				btc: capBefore.day ?
					processedSystem.metrics.marketCap.btc - capBefore.day.btc :
					0,
				usd: capBefore.day ?
					processedSystem.metrics.marketCap.usd - capBefore.day.usd :
					0,
			},
			week: {
				btc: capBefore.week ?
					processedSystem.metrics.marketCap.btc - capBefore.week.btc :
					0,
				usd: capBefore.week ?
					processedSystem.metrics.marketCap.usd - capBefore.week.usd :
					0,
			},
			month: {
				btc: capBefore.month ?
					processedSystem.metrics.marketCap.btc - capBefore.month.btc :
					0,
				usd: capBefore.month ?
					processedSystem.metrics.marketCap.usd - capBefore.month.usd :
					0,
			},
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
