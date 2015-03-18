MarketData._ensureIndex({ timestamp: 1 });
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
});
