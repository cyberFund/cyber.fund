Meteor.startup(function() {

	CF.processing.addPostprocessor(Meteor.bindEnvironment(function(source, timestamp, data) {
		if (source !== "cyberFund") {
			return;
		}

		data.forEach(function(newSystemData) {
			var updatedData = newSystemData.metrics;

			var aliases = newSystemData.aliases;

			if (aliases && (aliases.CoinMarketCap == newSystemData.name) &&
				(aliases.CurrencyName != aliases.CoinMarketCap))
				  // actually,here we have to check if currentData item already was updated.
					// little sense updating same field to same value again and again
			{
				updatedData.cyberName = aliases.CurrencyName;
			}
			updatedData.name = newSystemData.name; // useless
			updatedData.symbol = newSystemData.symbol; //useless
			updatedData.icon = newSystemData.icon;
			updatedData.lastUpdateTimestamp = newSystemData.timestamp;
			updatedData.rating = updatedData.rating || 0;

			CurrentData.upsert({
				name: newSystemData.name, // we re searching by this key
				symbol: newSystemData.symbol
			}, { $set: updatedData }); // and changeset contains same values..
		});
	}));

});
