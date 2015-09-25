Template['radarCard'].rendered = function () {
  
};

Template['radarCard'].helpers({
  'daysLeft': function (datestring, format) {
    return  moment(datestring, format).diff( moment() , 'days');
  },
  daysPassed: function (datestring, format) {
    return  moment().diff(moment(datestring, format), 'days');
  },
  name_: function () {
    return Blaze._globalHelpers._toU(this.system);
  }
});

Template['radarCard'].events({
  'click .bar': function (e, t) {
    
  }
});