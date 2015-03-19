Meteor.subscribe("current-data");

Template.marketData.helpers({
	systems: function() {
		return MarketData.find({});
	}
});
