// this file describes fetching of data from chaingear

var sourceUrl = "https://raw.githubusercontent.com/cyberFund/chaingear/gh-pages/chaingear.json";
var fetchTimeout = 15 * 1000;

var logger = CF.Utils.logger.getLogger("fetching - chaingear : v.0.3");
let print = logger.print;
print("sourceUrl", sourceUrl)
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

/**
 *
 * @param obj
 * @returns {{}} object with keys flattened. ok to use in conjunction with
 * collection.update({..}, {$set: flatten(obj)})
 */
function flatten(obj) { //todo move to utils..
  if (!_.isObject(obj)) return;

  var result = {};

  function add(key, prop) {
    result[key] = prop;
  }

  function iter(currentKey, object) {
    _.each(object, function(v, k) {

      var key = currentKey ? currentKey + "." + k : k;
      if (_.isArray(v)) {
        add(key, v);
      } else {
        if (_.isObject(v) && !(_.isDate(v) || _.isArray(v)) ) {
          iter(key, v);
        } else {
          add(key, v);
        }
      }
    });
  }

  iter("", obj);
  return result;
}
var fetch = function() {
  logger.info("Fetching data from cyberFund - chaingear");
  try {
    var res = HTTP.call("HEAD", sourceUrl, {
      timeout: fetchTimeout
    });

    var previous = Extras.findOne({
      _id: "chaingearEtag"
    });

    if (!res || !res.headers || !res.headers.etag) return;
    var debug = false;
    if (!previous || (previous.etag != res.headers.etag) || debug) {
      logger.info("new etag for chaingear - " + res.headers.etag + "; fetching chaingear");

      CF.fetching.get(sourceUrl, {
        timeout: fetchTimeout
      },
        function(error, getResult) {
          if (error) {
            logger.error("Error while fetching cyberfund:", error);
            return;
          }

          var crowdsalesList = [];
          var projectsList = [];
          _.each(getResult, function(system) {
            system._id = system._id || system.system;

            if (!system.token) {
              logger.info("no .token for system '" + system._id + "'");
              return;
            }

            if (system.crowdsales) { // format crowdsales dates

              if (_.isString(system.crowdsales.start_date)) {
                system.crowdsales.start_date = new Date(system.crowdsales.start_date);
              }

              if (_.isString(system.crowdsales.end_date)) {
                system.crowdsales.end_date = new Date(system.crowdsales.end_date);
              }

              crowdsalesList.push(system._id);
            }

            if (system.descriptions && system.descriptions.state == "Project")
              projectsList.push(system._id);

            if (system.specs) { // push supply & caps from chaingear to metrics

              system.metrics = system.metrics || {};
              if (system.specs.supply) {
                system.metrics.supply = system.specs.supply;
              }
              if (system.specs.cap) {
                system.metrics.cap = system.specs.cap;
              }
              if (system.specs.price) {
                system.metrics.price = system.specs.price;
              }
            }

            var doc = CurrentData.findOne({
              _id: system._id
            });

            if (!doc) {
              console.log("no doc for system '" + system._id + "'");
              console.log("inserting system " + system._id);
              CurrentData.insert(system);
            } else {
              var set = flatten(system);
              //_.omit(system, ['system']); //system:

              if (system.specs) {
                if (system.specs.cap && system.specs.supply) {
                  set["metrics.price.usd"] = system.specs.cap.usd / system.specs.supply;

                  set["metrics.price.btc"] = system.specs.cap.btc / system.specs.supply;
                }
              }

              var modifier = {
                $set: set
              };

              CurrentData.upsert({
                _id: system._id
              }, modifier);
            }
          });

          // store lists of projects and crowdsales
          Extras.upsert({
            _id: "radarList"
          }, {
            crowdsales: crowdsalesList,
            projects: projectsList,
            meta: {
              domain: "chaingear",
              type: "cache"
            }
          });

          // mark current version so we won't download it again. todo: use github webhook instead
          Extras.upsert({
            _id: "chaingearEtag"
          }, {
            etag: res.headers.etag,
            meta: {
              type: "synchronization",
              domain: "chaingear"
            }
          });

        });
    } else {
      console.log("chaingear not changed..");
    }
  } catch (e) {
    console.log("probably no connection while trying to fetch cynberfund");
  }
};

Meteor.startup(function(){
  fetch();
});

SyncedCron.add({
  name: "fetch chaingear data",
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.cron("0/2 * * * *", false);
  },
  job: function() {
    fetch();
  }
});
