Meteor.startup(function() {
/*
	CF.processing.addPostprocessor(function(source, timestamp, data) {
		if (source !== "cyberFund") {
			return;
		}

		data.forEach(function (newSystemData) {
			var set = _.omit(newSystemData, ['system', 'symbol']);
			var modifier = {$set: set};
			if (!set["ratings.rating"]) modifier.$unset = {"ratings.rating": true};
			CurrentData.upsert(selector, modifier);
		});
	});*/
});
