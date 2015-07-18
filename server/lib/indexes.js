Meteor.startup(function() {

/*	MarketData._ensureIndex({ timestamp: 1 });
	// Neither name, nor symbol are unique, but their pair is.
	MarketData._ensureIndex({ name: 1, symbol: 1 });
	MarketData._ensureIndex({ source: 1 });

	MarketData._ensureIndex({
		timestamp: 1,
		name: 1,
		symbol: 1,
		source: 1,
	}, {
		unique: true,
		sparse: true,
		dropDups: true,
		//background: true
	});
*/
	//CurrentData._ensureIndex({ name: 1, symbol: 1 });

	CurrentData._ensureIndex({
		"system": 1,
		"token.token_symbol": 1
	}, {
		unique: true,
		sparse: true,
		dropDups: true
		//background: true
	});

});
