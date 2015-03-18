MarketData._ensureIndex({ timestamp: 1 });
MarketData._ensureIndex({ name: 1 });
MarketData._ensureIndex({ source: 1 });

MarketData._ensureIndex({
	timestamp: 1,
	name: 1,
	source: 1,
}, {
	unique: true,
	sparse: true,
	dropDups: true,
});
