this.fetching = {

	fetchData: function(url, options, callback) {

		HTTP.get(url, options, function(error, result) {

			if (error) {

				callback(error);

			} else if (!result.data) {

				callback(new Error("Cannot parse new data!"));

			} else {

				callback(error, result.data);

			}

		});

	},

	processData: function(data, source, callback) {

		var systems, processedData;

		if (!source) {

			callback(new Error("Cannot process data without a source!"));

		} else {

			systems = data.markets;
			processedData = systems.map(function(system) {
				var metrics = _.omit(system, "position", "name", "symbol", "timestamp");
				return {
					name: system.name,
					symbol: system.symbol,
					timestamp: system.timestamp,
					source: source,
					metrics: metrics,
				};
			});

			callback(null, processedData);

		}

	},

	saveData: function(data, callback) {
		MarketData.rawCollection().insert(data, function(error, result) {
			if (error) {
				callback(error);
			} else {
				callback(null, true);
			}
		});
	},

};

Meteor.startup(function() {

	var sourceUrl = "http://coinmarketcap.northpole.ro/api/v5/all.json";
	var sourceName = "CoinMarketCap";
	var fetchInterval = 5 * 60 * 1000;
	var fetchOptions = { timeout: fetchInterval };

	fetch = function() {

		console.log("Fetching data from " + sourceName + "...");
		fetching.fetchData(sourceUrl, fetchOptions, function(error, result) {
			if (error) {
				console.error("Error while fetching:", error);
				return;
			}

			fetching.processData(result, sourceName, function(error, result) {
				if (error) {
					console.error("Error while processing:", error);
					return;
				}

				fetching.saveData(result, function(error, result) {
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
