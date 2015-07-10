var sourceUrl = "http://coinmarketcap.northpole.ro/api/v5/all.json";
var fetchInterval = ("RARE_FETCH" in process.env ? 50 : 5) * 60 * 1000;

var logger = log4js.getLogger("meteor-fetching");

CF.fetching.coinMarketCap = {};

CF.fetching.coinMarketCap.processData = function(data, callback) {
	var systems = data.markets;
	var fetchedTimestamp = data.timestamp;

	var dayAgoTimestamp = CF.processing.getNearestTimestamp("CoinMarketCap",
		moment.unix(fetchedTimestamp).subtract(1, "days").unix());

	var weekAgoTimestamp = CF.processing.getNearestTimestamp("CoinMarketCap",
		moment.unix(fetchedTimestamp).subtract(1, "weeks").unix());

	var monthAgoTimestamp = CF.processing.getNearestTimestamp("CoinMarketCap",
		moment.unix(fetchedTimestamp).subtract(1, "months").unix());

	var processedData = systems.map(function(rawSystem) {
		var processedSystem = {
			name: rawSystem.name,
			symbol: rawSystem.symbol,
			source: "CoinMarketCap",
			timestamp: rawSystem.timestamp,
			metrics: _.omit(rawSystem, "position", "name", "symbol", "timestamp")
		};

		processedSystem.metrics.volume24.btc = parseFloat(processedSystem.metrics.volume24.btc) || 0;

		var tradeVolumeMedians = {
			day: CF.processing.getMedianValue("CoinMarketCap",
				rawSystem, "metrics.volume24.btc", dayAgoTimestamp),
			week: CF.processing.getMedianValue("CoinMarketCap",
				rawSystem, "metrics.volume24.btc", weekAgoTimestamp),
			month: CF.processing.getMedianValue("CoinMarketCap",
				rawSystem, "metrics.volume24.btc", monthAgoTimestamp)
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
			day: CF.processing.getNearestDocument("CoinMarketCap", dayAgoTimestamp,
				rawSystem, "metrics.availableSupplyNumber"),
			week: CF.processing.getNearestDocument("CoinMarketCap", weekAgoTimestamp,
				rawSystem, "metrics.availableSupplyNumber"),
			month: CF.processing.getNearestDocument("CoinMarketCap", monthAgoTimestamp,
				rawSystem, "metrics.availableSupplyNumber")
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
			day: CF.processing.getNearestDocument("CoinMarketCap", dayAgoTimestamp,
				rawSystem, "metrics.marketCap"),
			week: CF.processing.getNearestDocument("CoinMarketCap", weekAgoTimestamp,
				rawSystem, "metrics.marketCap"),
			month: CF.processing.getNearestDocument("CoinMarketCap", monthAgoTimestamp,
				rawSystem, "metrics.marketCap")
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
					usd: 0
				};
			}
		});

		return processedSystem;
	});

	callback(null, processedData);
};

Meteor.startup(function() {
	var fetch = function() {
		logger.info("Fetching data from CoinMarketCap...");
		CF.fetching.get(sourceUrl, { timeout: fetchInterval }, function(error, getResult) {
			if (error) {
				logger.error("Error while fetching coinmarket:", error);
				return;
			}

			CF.fetching.coinMarketCap.processData(getResult, function(error, processResult) {
				if (error) {
					logger.error("Error while processing:", error);
					return;
				}

				CF.fetching.saveToDb(processResult, function(error, saveResult) {
					if (error) {
						logger.error("Error while saving:", error);
						return;
					}
					Meteor.wrapAsync(function () {
						CF.processing.doPostprocessing("CoinMarketCap", getResult.timestamp, processResult);
					});
					logger.info("Data from CoinMarketCap saved!");
				});
			});
		});
	};

	fetch();
	Meteor.setInterval(fetch, fetchInterval);

});
