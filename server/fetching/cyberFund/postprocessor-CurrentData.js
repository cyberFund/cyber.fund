Meteor.startup(function() {

	processing.addPostprocessor(Meteor.bindEnvironment(function(source, timestamp, data) {
		if (source !== "cyberFund") {
			return;
		}

		data.forEach(function(newSystemData) {
			var updatedData = newSystemData.metrics;

			updatedData.name = newSystemData.name;
			updatedData.symbol = newSystemData.symbol;
			updatedData.lastUpdateTimestamp = newSystemData.timestamp;

			CurrentData.upsert({
				name: newSystemData.name,
				symbol: newSystemData.symbol,
			}, { $set: updatedData });
		});
	}));

});
