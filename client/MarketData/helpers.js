Meteor.startup(function() {

	Template.marketData.onCreated(function() {
		this.subscribe("current-data");
	});

	Template.marketData.helpers({
		systems: function() {
			return MarketData.find({});
		}
	});

});
