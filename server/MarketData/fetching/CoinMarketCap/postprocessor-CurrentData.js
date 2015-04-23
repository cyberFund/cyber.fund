Meteor.startup(function() {

	processing.addPostprocessor(Meteor.bindEnvironment(function(source, timestamp, data) {
		if (source !== "CoinMarketCap") {
			return;
		}

		var capHistory = {};

		var monthTimestamps = [];
		var i, curTimestamp;
		// From 0 to 30 days ago - meaning getting today's data too.
		for (i = 0; i <= 30; i += 1) {
			curTimestamp = processing.getNearestTimestamp("CoinMarketCap",
				moment.unix(timestamp).subtract(i, "days").unix());

			processing.getAllNearest("CoinMarketCap", curTimestamp, [
				"timestamp",
				"name",
				"symbol",
				"metrics.marketCap.btc",
				"metrics.marketCap.usd",
			]).fetch().forEach(function(doc) {
				var id = doc.name + "/" + doc.symbol;
				capHistory[id] = capHistory[id] || [];
				capHistory[id].push({
					timestamp: doc.timestamp,
					cap: doc.metrics.marketCap,
				});
			});
		}

		data.forEach(function(newSystemData) {
			CurrentData.upsert({
				name: newSystemData.name,
				symbol: newSystemData.symbol,
			}, { $set: {
				name: newSystemData.name,
				symbol: newSystemData.symbol,
				lastUpdateTimestamp: newSystemData.timestamp,
				supply: newSystemData.metrics.availableSupplyNumber,
				supplyChange: newSystemData.metrics.supplyChange,
				tradeVolume: parseFloat(newSystemData.metrics.volume24.btc) || 0,
				tradeVolumeMedianDeviation: newSystemData.metrics.tradeVolumeMedianDeviation,
				cap: {
					btc: parseFloat(newSystemData.metrics.marketCap.btc) || 0,
					usd: parseFloat(newSystemData.metrics.marketCap.usd) || 0,
				},
				capChange: newSystemData.metrics.capChange,
				price: {
					btc: parseFloat(newSystemData.metrics.price.btc) || 0,
					usd: parseFloat(newSystemData.metrics.price.usd) || 0,
				},
				capHistory: capHistory[newSystemData.name + "/" + newSystemData.symbol],
			}});
		});
	}));

});
