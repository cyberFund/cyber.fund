var sourceUrl = "http://cyber.fund/data.json";
var fetchInterval = 30 * 60 * 1000;

this.fetching.cyberFund = {};

this.fetching.cyberFund.processData = function(data, callback) {
	var timestamp = moment().unix();

	var processedData = data.map(function(system) {
		system.source = "cyberFund";
		system.timestamp = timestamp;
		return system;
	});

	callback(null, processedData);
};

Meteor.startup(function() {
	var fetch = function() {
		console.log("Fetching data from cyberFund...");
		fetching.get(sourceUrl, { timeout: fetchInterval }, function(error, getResult) {
			if (error) {
				console.error("Error while fetching:", error);
				return;
			}

			fetching.cyberFund.processData(getResult, function(error, processResult) {
				if (error) {
					console.error("Error while processing:", error);
					return;
				}

				fetching.saveToDb(processResult, function(error, saveResult) {
					if (error) {
						console.error("Error while saving:", error);
						return;
					}

					processing.doPostprocessing("cyberFund", processResult[0].timestamp, processResult);
					console.log("Data from cyberFund saved!");
				});
			});
		});
	};

	Meteor.setInterval(fetch, fetchInterval);
	fetch();
});
