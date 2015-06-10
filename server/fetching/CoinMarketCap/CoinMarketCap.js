var sourceUrl = "http://coinmarketcap.northpole.ro/api/v5/all.json";
var fetchInterval = ("RARE_FETCH" in process.env ? 50 : 5) * 60 * 1000 * 100;

this.fetching.coinMarketCap = {};

this.fetching.coinMarketCap.processData = function(data, callback) {
	var systems = data.markets;
	var fetchedTimestamp = data.timestamp;

	var dayAgoTimestamp = processing.getNearestTimestamp("CoinMarketCap",
		moment.unix(fetchedTimestamp).subtract(1, "days").unix());

	var weekAgoTimestamp = processing.getNearestTimestamp("CoinMarketCap",
		moment.unix(fetchedTimestamp).subtract(1, "weeks").unix());

	var monthAgoTimestamp = processing.getNearestTimestamp("CoinMarketCap",
		moment.unix(fetchedTimestamp).subtract(1, "months").unix());

	var processedData = systems.map(function(rawSystem) {
		var processedSystem = {
			name: rawSystem.name,
			symbol: rawSystem.symbol,
			source: "CoinMarketCap",
			timestamp: rawSystem.timestamp,
			metrics: _.omit(rawSystem, "position", "name", "symbol", "timestamp"),
		};

		processedSystem.metrics.volume24.btc = parseFloat(processedSystem.metrics.volume24.btc) || 0;

		var tradeVolumeMedians = {
			day: processing.getMedianValue("CoinMarketCap",
				rawSystem, "metrics.volume24.btc", dayAgoTimestamp),
			week: processing.getMedianValue("CoinMarketCap",
				rawSystem, "metrics.volume24.btc", weekAgoTimestamp),
			month: processing.getMedianValue("CoinMarketCap",
				rawSystem, "metrics.volume24.btc", monthAgoTimestamp),
		};

		processedSystem.metrics.tradeVolumeMedianDeviation = {};
		["day", "week", "month"].forEach(function(time) {
			if (tradeVolumeMedians[time]) {
				processedSystem.metrics.tradeVolumeMedianDeviation[time] =
					parseFloat((processedSystem.metrics.volume24.btc - tradeVolumeMedians.day).toFixed(8)) || 0;
			} else {
				processedSystem.metrics.tradeVolumeMedianDeviation[time] = 0;
			}
		});

		var supplyBefore = {
			day: processing.getNearestDocument("CoinMarketCap", dayAgoTimestamp,
				rawSystem, "metrics.availableSupplyNumber"),
			week: processing.getNearestDocument("CoinMarketCap", weekAgoTimestamp,
				rawSystem, "metrics.availableSupplyNumber"),
			month: processing.getNearestDocument("CoinMarketCap", monthAgoTimestamp,
				rawSystem, "metrics.availableSupplyNumber"),
		};

		processedSystem.metrics.supplyChange = {};
		["day", "week", "month"].forEach(function(time) {
			if (supplyBefore[time]) {
				processedSystem.metrics.supplyChange[time] =
					parseFloat((processedSystem.metrics.availableSupplyNumber -
						supplyBefore[time]).toFixed(8)) || 0;
			} else {
				processedSystem.metrics.supplyChange[time] = 0;
			}
		});

		var capBefore = {
			day: processing.getNearestDocument("CoinMarketCap", dayAgoTimestamp,
				rawSystem, "metrics.marketCap"),
			week: processing.getNearestDocument("CoinMarketCap", weekAgoTimestamp,
				rawSystem, "metrics.marketCap"),
			month: processing.getNearestDocument("CoinMarketCap", monthAgoTimestamp,
				rawSystem, "metrics.marketCap"),
		};

		processedSystem.metrics.capChange = {};
		["day", "week", "month"].forEach(function(time) {
			if (capBefore[time]) {
				processedSystem.metrics.capChange[time] = {
					btc: parseFloat((processedSystem.metrics.marketCap.btc - capBefore[time].btc).toFixed(8)) || 0,
					usd: parseFloat((processedSystem.metrics.marketCap.usd - capBefore[time].usd).toFixed(8)) || 0,
				};
			} else {
				processedSystem.metrics.capChange[time] = {
					btc: 0,
					usd: 0,
				};
			}
		});

		return processedSystem;
	});

	callback(null, processedData);
};

Meteor.startup(function() {
	var fetch = function() {
		console.log("Fetching data from CoinMarketCap...");
		fetching.get(sourceUrl, { timeout: fetchInterval }, function(error, getResult) {
			if (error) {
				console.error("Error while fetching:", error);
				return;
			}

			fetching.coinMarketCap.processData(getResult, function(error, processResult) {
				if (error) {
					console.error("Error while processing:", error);
					return;
				}

				fetching.saveToDb(processResult, function(error, saveResult) {
					if (error) {
						console.error("Error while saving:", error);
						return;
					}

					processing.doPostprocessing("CoinMarketCap", getResult.timestamp, processResult);
					console.log("Data from CoinMarketCap saved!");
				});
			});
		});
	};

	Meteor.setInterval(fetch, fetchInterval);
	fetch();
});
