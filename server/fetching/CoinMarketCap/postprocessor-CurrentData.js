Meteor.startup(function() {
	CF.processing.addPostprocessor(function(source, timestamp, data) {
		if (source !== "CoinMarketCap") {
			return;
		}

		var capHistory = {};

		var monthTimestamps = [];
		var i, curTimestamp;
		// From 0 to 30 days ago - meaning getting today's data too.
		for (i = 0; i <= 30; i += 1) {
			curTimestamp = CF.processing.getNearestTimestamp("CoinMarketCap",
				moment.unix(timestamp).subtract(i, "days").unix());

			var nearest =
			CF.processing.getAllNearest("CoinMarketCap", curTimestamp, [
				"timestamp",
				"name",
				"symbol",
				"metrics.marketCap.btc",
				"metrics.marketCap.usd"
			]);
		if (nearest && nearest.fetch) nearest.forEach(function(doc) {
				var id = doc.name + "/" + doc.symbol;
				capHistory[id] = capHistory[id] || [];
				capHistory[id].push({
					timestamp: doc.timestamp,
					cap: doc.metrics.marketCap
				});
			});
		}

		data.forEach(function(newSystemData) {
			var metrics = newSystemData.metrics;

			var fieldsToUpdate = {
				name: newSystemData.name,
				symbol: newSystemData.symbol,
				icon: newSystemData.icon,
				lastUpdateTimestamp: newSystemData.timestamp,
				supply: metrics.availableSupplyNumber,
				supplyChange: metrics.supplyChange,
				tradeVolume: parseFloat(metrics.volume24.btc) || 0,
				tradeVolumeMedianDeviation: metrics.tradeVolumeMedianDeviation,
				cap: {
					btc: parseFloat(metrics.marketCap.btc) || 0,
					usd: parseFloat(metrics.marketCap.usd) || 0
				},
				capChange: metrics.capChange,
				price: {
					btc: parseFloat(metrics.price.btc) || 0,
					usd: parseFloat(metrics.price.usd) || 0
				},
				capHistory: capHistory[newSystemData.name + "/" + newSystemData.symbol]
			};

			fieldsToUpdate.supplyChangePercents = {};
			["day", "week", "month"].forEach(function(time) {
				fieldsToUpdate.supplyChangePercents[time] =
					parseFloat((fieldsToUpdate.supplyChange[time] * 100 /
						(fieldsToUpdate.supply - fieldsToUpdate.supplyChange[time])).toFixed(8));
			});
			fieldsToUpdate.capChangePercents = {};
			["day", "week", "month"].forEach(function(time) {
				fieldsToUpdate.capChangePercents[time] = {
					btc: parseFloat((metrics.capChange[time].btc * 100 /
						(fieldsToUpdate.cap.btc - metrics.capChange[time].btc)).toFixed(8)),
					usd: parseFloat((metrics.capChange[time].usd * 100 /
						(fieldsToUpdate.cap.usd - metrics.capChange[time].usd)).toFixed(8))
				};
			});

			CurrentData.upsert({
				system: newSystemData.name,
				symbol: newSystemData.symbol
			}, { $set: fieldsToUpdate });
		});
	});

});
