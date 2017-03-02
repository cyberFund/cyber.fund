import {CurrentData, Metrics, FastData} from '/imports/api/collections'
import calculatables from '/imports/api/server/calculatables'
setRatingPlaces = function(){
  var idx = 1;
  CurrentData.find({}, {sort: {"calculatable.RATING.sum": -1}}).forEach(function(it){
    CurrentData.update({_id: it._id}, {$set: {"calculatable.RATING.index": idx++}});
  });
};

SyncedCron.add({
  name: "daily calculations 1",
  schedule: function (parser) {
    // parser is a later.parse object
    return parser.cron("40 * * * *", false);
  },
  job: function () {
    calculatables.triggerCalc("firstDatePrice");
  }
});

SyncedCron.add({
  name: "daily calculations 2",
  schedule: function (parser) {
    // parser is a later.parse object
    return parser.cron("41 * * * *", false);
  },
  job: function () {
    calculatables.triggerCalc("nLinksWithTag");
  }
});

SyncedCron.add({
  name: "daily calculations 3",
  schedule: function (parser) {
    // parser is a later.parse object
    return parser.cron("42 * * * *", false);
  },
  job: function () {
    calculatables.triggerCalc("nLinksWithType");
  }
});

SyncedCron.add({
  name: "daily calculations 4",
  schedule: function (parser) {
    // parser is a later.parse object
    return parser.cron("43 * * * *", false);
  },
  job: function () {
    calculatables.triggerCalc("RATING");
    setRatingPlaces();
  }
});
