Meteor.startup(function() {

	var ORIGINAL_API_URL = "http://coinmarketcap.northpole.ro/api/v5/all.json";
	var ORIGINAL_API_NAME = "CoinMarketCap";
	var ORIGINAL_API_FETCH_INTERVAL = 5 * 60 * 1000;


	var fetchData = function( callback ) {

		HTTP.get( ORIGINAL_API_URL, {
			timeout: ORIGINAL_API_FETCH_INTERVAL
		}, callback );

	};

	var proccessFetchedData = function(data) {

		var timestamp = data.timestamp;
		var systems = data.markets;

		var processedData = systems.map(function(system) {
			return {
				name: system.name,
				symbol: system.symbol,
				timestamp: timestamp,
				source: ORIGINAL_API_NAME,
				metrics: {
					marketCap: system.marketCap,
					price: system.price,
					availableSupply: system.availableSupply,
					availableSupplyNumber: system.availableSupplyNumber,
					volume24: system.volume24,
					change1h: system.change1h,
					change7h: system.change7h,
					change7d: system.change7d,
				},
			};
		});

		return processedData;

	};

	var saveFetchedData = function(error, result) {

		var processedData;

		if (error) {

			console.error("Cannot fetch original API data!", error);

		} else {

			console.log("Fetched", ORIGINAL_API_NAME ,"at:", result.data.timestamp);

			processedData = proccessFetchedData(result.data);

			console.log("Inserting", processedData.length, "documents...");
			MarketData.rawCollection().insert(processedData, function(error, result) {

				if (error) {

					console.error("Cannot insert new data!", error);

				} else {

					console.log("Done!");

				}

			});

		}

	};

	Meteor.setInterval(function() {
		fetchData( saveFetchedData );
	}, ORIGINAL_API_FETCH_INTERVAL );

	fetchData( saveFetchedData );
});
