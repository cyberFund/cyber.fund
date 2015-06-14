var sourceUrl = "https://raw.githubusercontent.com/cyberFund/chaingear/master/chaingear.json";
var fetchInterval = 30 * 60 * 1000;

var logger = log4js.getLogger("meteor-fetching");

CF.fetching.cyberFund = {};

CF.fetching.cyberFund.processData = function(data, callback) {
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
		logger.info("Fetching data from cyberFund...");
		CF.fetching.get(sourceUrl, { timeout: fetchInterval }, function(error, getResult) {
			if (error) {
				logger.error("Error while fetching cyberfund:", error);
				return;
			}

			CF.fetching.cyberFund.processData(getResult, function(error, processResult) {
				if (error) {
					logger.error("Error while processing:", error);
					return;
				}

				CF.fetching.saveToDb(processResult, function(error, saveResult) {
					if (error) {
						logger.error("Error while saving:", error);
						return;
					}

					CF.processing.doPostprocessing("cyberFund", processResult[0].timestamp, processResult);
					logger.info("Data from cyberFund saved!");
				});
			});
		});
	};

	Meteor.setInterval(fetch, fetchInterval);
	fetch();
});
