Meteor.startup(function() {

	processing.addPostprocessor(Meteor.bindEnvironment(function(source, timestamp, data) {
		if (source !== "CoinMarketCap") {
			return;
		}

		data.forEach(function(newSystemData) {
			CurrentData.upsert({
				name: newSystemData.name,
				symbol: newSystemData.symbol,
			}, {
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
			});
		});
	}));

});
