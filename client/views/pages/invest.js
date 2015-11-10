Template['invest'].rendered = function () {
  Meteor.call("getInvestData");
  Meteor.setInterval(function(){
    var sT = moment("2016-01-01 00:00:00").diff(moment(), "seconds"),
      s = sT%60;
    sT= (sT-s)/60;
    var m = sT%60;
    sT= (sT-m)/60;
    var h = sT%24,
    d= (sT-h)/24;
    Session.set("timeleft", {
      days: d,
      hours: h,
      minutes:m,
      seconds: s
    })
  }, 1000)
};

function _raised(dataobj) {
  return dataobj.total_received ? dataobj.total_received/100000000 : 0
}

Template['invest'].helpers({
  'raised': function (){
    return this.invest ? _raised(this.invest) : 0
  },
  'left': function(){
    return this.invest ? 42 - _raised(this.invest) : 0
  },
  'cap': function(){
    return this.invest ? 100/3 * _raised(this.invest) : 0
  },
  'nicheShare': function(){
    var share = (this.invest && this.cap) ? (100/ 3 *_raised(this.invest)) / this.cap.btc / 200: 0;
    if (share == 0) return 0;
    var rev = Math.round(1/share/10000)*10000;

    return "1/"+rev
  },
  'timeleft': function(){
    return Session.get("timeleft")
  }
});

Template['invest'].events({
  'click .bar': function (e, t) {
    
  }
});