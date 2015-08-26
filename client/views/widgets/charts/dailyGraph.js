Template['dailyGraph'].rendered = function () {
  var ticks = [];
  var self = this;
  console.log("here");
  Tracker.autorun(function (comp) {
    if (!self.data || !self.data.graphData) return;
    var data =self.data.graphData.fetch();
    var current = moment.utc();
    current.minutes(current.minutes() - current.minutes()%5);
    var iterate = current.subtract(1, 'days');
    while (iterate < current) {
      var selector = {
        day: iterate.date(),
        hour: iterate.hours(),
        minute: iterate.minutes(),

      }
      var item = FastData.findOne()
      var key = [year, month, day].join(".");
      var val = self.data.dailyData[year] ? self.data.dailyData[year][month] ?
        self.data.dailyData[year][month][day] : null : null;
      var tick = {
        key: key,
        value: val || null,
        needKey: iterate.weeks()%4==0 //only will display those days
      };
      ticks.push(tick);
      iterate = iterate.add(7, "days");
    }
  });
};

Template['dailyGraph'].helpers({
  'foo': function () {
    
  }
});

Template['dailyGraph'].events({
  'click .bar': function (e, t) {
    
  }
});