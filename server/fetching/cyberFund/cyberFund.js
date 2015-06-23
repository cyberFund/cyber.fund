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
          var selector = {
            name: system.name,
            symbol: system.symbol
          };
          if (!CurrentData.findOne(selector)) {
            CurrentData.insert(system);
          }
          else {
            CurrentData.upsert(selector, {$set: _.omit(system, ['name', 'symbol'])});
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

