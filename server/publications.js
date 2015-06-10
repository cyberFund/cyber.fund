
Meteor.publish("current-data", function(options) {
	options = options || {};
	console.log(options);
	var selector = {"cap.btc": { $gt: 0 }};
	var params = { sort: { "rating": -1, "cap.btc": -1  }};
	if ( !isNaN(options.rating)) selector["rating"] = {$gte: options.rating};
	if ( !isNaN(options.limit)) params.limit = options.limit;
	return CurrentData.find(selector, params);
});

Meteor.methods({
	currentDataCount: function(){
		return CurrentData.find({"cap.btc": { $gt: 0 }}).count();
	}
});

Meteor.publish("fresh-price", function(){
	return MarketData.find({symbol:'BTC', 'metrics.price': {$exists: true}},
		{sort: {timestamp: -1}, limit: 1});
});