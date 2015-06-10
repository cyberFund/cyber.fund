
Meteor.publish("current-data", function(limit) {
	return CurrentData.find({"cap.btc": { $gt: 0 }, "rating": {$gte: limit}},
		{ sort: { "rating": -1, "cap.btc": -1  }});
});


Meteor.publish("fresh-price", function(){
	return MarketData.find({symbol:'BTC', 'metrics.price': {$exists: true}},
		{sort: {timestamp: -1}, limit: 1});
});