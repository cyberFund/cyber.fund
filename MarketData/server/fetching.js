Meteor.startup(function() {

	var ORIGINAL_API_URL = "http://coinmarketcap.northpole.ro/api/v5/all.json";
	var ORIGINAL_API_FETCH_INTERVAL = 5 * 60 * 1000;


	var fetchData = function( callback ) {

		HTTP.get( ORIGINAL_API_URL, {
			timeout: ORIGINAL_API_FETCH_INTERVAL
		}, callback );

	};

	var saveFetchedData = function( error, result ) {

		if ( error ) {
			console.error( "Cannot fetch original API data!", error );
		} else {
			console.log( "Timestamp:", result.data.timestamp );
			MarketData.insert( result.data );
		}

	};

	Meteor.setInterval(function() {
		fetchData( saveFetchedData );
	}, ORIGINAL_API_FETCH_INTERVAL );

	fetchData( saveFetchedData );
});
