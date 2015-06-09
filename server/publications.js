
Meteor.publish("current-data", function() {
	return CurrentData.find({}, { sort: { "cap.btc": -1 } });
});

Meteor.publish("current-data-one", function() {
	return CurrentData.find({"cap.btc": { $gt: 0 }}, { sort: { "cap.btc": -1 } });
});


Meteor.publish("fresh-price", function(){
	return MarketData.find({symbol:'BTC', 'metrics.price': {$exists: true}}, {sort: {timestamp: -1}, limit: 1});
});