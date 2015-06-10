
Meteor.publish("current-data", function(limit) {
	return CurrentData.find({"cap.btc": { $gt: 0 }}, { sort: { "rating": -1, "cap.btc": -1  }, limit: limit });
});
Meteor.methods({
	'currentDataCount': function () {
		return CurrentData.find({"cap.btc": {$gt: 0}}).count();
	}
});


Meteor.publish("fresh-price", function(){
	return MarketData.find({symbol:'BTC', 'metrics.price': {$exists: true}}, {sort: {timestamp: -1}, limit: 1});
});