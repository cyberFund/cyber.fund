var sourceUrl = "https://raw.githubusercontent.com/cyberFund/chaingear/gh-pages/chaingear.json";
var fetchInterval = 30 * 60 * 1000;

var logger = log4js.getLogger("meteor-fetching");

CF.fetching.cyberFund = {};

CF.fetching.cyberFund.processData = function (data, callback) {
  var timestamp = moment().unix();

  var processedData = data.map(function (system) {
    system.source = "cyberFund";
    system.timestamp = timestamp;
    return system;
  });

  callback(null, processedData);
};

Meteor.startup(function () {
  var fetch = function () {
    logger.info("Fetching data from cyberFund...");
    var res = HTTP.call("HEAD", sourceUrl, {timeout: fetchInterval});
    var previous = Extras.findOne({_id: 'chaingear_etag'});
    if (!res || !res.headers || !res.headers.etag) return;
    if (!previous || (previous.etag != res.headers.etag)) {
      logger.info("new etag for chaingear - " + res.headers.etag + "; fetching chaingear");

      CF.fetching.get(sourceUrl, {timeout: fetchInterval}, function (error, getResult) {
        if (error) {
          logger.error("Error while fetching cyberfund:", error);
          return;
        }
        //if (CurrentData.find().count() < 1000) {
        _.each(getResult, function (system) {
          var selector = CF.CurrentData.selectors.name_symbol(system.name, system.symbol);
          var doc = CurrentData.findOne(selector);
          if (!doc) {
            if (system.specs && (system.specs.supply || system.specs.cap)) {
              // push supply & caps to metrics
              system.metrics = system.metrics || {};
              system.metrics.supply = system.specs.supply;
              system.metrics.cap = system.specs.cap

            }

            CurrentData.insert(system);
          }
          else {
            var set = _.omit(system, ['system', 'symbol']);
            // push supply & caps to metrics
            if (system.specs) {
              if (doc.specs.supply) {
                set["metrics.supply"] = system.specs.supply;
              }
              if (doc.specs.cap) {
                set["metrics.cap.usd"] = system.specs.cap.usd;
                set["metrics.cap.btc"] = system.specs.cap.btc;
              }
            }

            var modifier = {$set: set};
            if (!set["ratings.rating_cyber"]) modifier.$unset = {"ratings.rating_cyber": true};
            CurrentData.upsert(selector, modifier);
          }
        });
        //}
      });
      Extras.upsert({_id: 'chaingear_etag'}, {etag: res.headers.etag});
    } else {
      console.log("chaingear not changed..")
    }
  };

  fetch();
  Meteor.setInterval(fetch, fetchInterval);
});

