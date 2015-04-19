Meteor.startup(function() {

	processing.addPostprocessor(Meteor.bindEnvironment(function(source, timestamp, data) {
		if (source !== "CoinMarketCap") {
			return;
		}

		var monthAgoTimestamp = moment.unix(timestamp).subtract(1, "months").unix();

		var capHistory = {};
		var capHistoryRaw = MarketData.find({
			timestamp: { $gt: monthAgoTimestamp },
			source: "CoinMarketCap",
		}, {
			sort: { timestamp: 1 },
			fields: {
				timestamp: 1,
				name: 1,
				symbol: 1,
				"metrics.marketCap.btc": 1,
				"metrics.marketCap.usd": 1,
			}
		}).fetch();
		console.log("capHistoryRaw size:", capHistoryRaw.length);

		capHistoryRaw.forEach(function(rawCap) {
			var id = rawCap.name + "/" + rawCap.symbol;
			capHistory[id] = capHistory[id] || [];
			capHistory[id].push({
				timestamp: rawCap.timestamp,
				cap: rawCap.metrics.marketCap,
			});
		});

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
