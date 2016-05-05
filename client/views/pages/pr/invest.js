Meteor.startup(function() {
  Meteor.setInterval(function() {
    var sT = moment().diff(moment("2016-01-01 00:00:00"), "seconds");
    var s = sT % 60;
    sT = (sT - s) / 60;
    var m = sT % 60;
    sT = (sT - m) / 60;
    var h = sT % 24;
    var d = (sT - h) / 24;
    Session.set("timeright", {
      days: d,
      hours: h,
      minutes: m,
      seconds: s
    })
  }, 1000)
});

Template['invest'].onCreated(function() {
  this.subscribe('investData');
});

Template['invest'].rendered = function() {
  Meteor.call("getInvestData");
  var h = FlowRouter.current().context.hash;
  if (h) {
    h = $('#' + h);
    if (h) {
      h = h.offset().top;
      if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
        window.setTimeout(function() {
          window.scrollTo(0, h);
        }, 0);
      } else {
        $('html, body').animate({
          scrollTop: h
        }, 400);
      }
    }
  }
};

function _raised(dataobj) {
  return dataobj.final_balance ? dataobj.final_balance / 100000000 : 0
}

function _invest() {
  return Extras.findOne({
    _id: "invest_balance"
  })
}

function _cap() {
  return Extras.findOne({
    _id: "total_cap"
  })
}

Template['invest'].helpers({
  invest: function() {
    return _invest();
  },
  cap: function() {
    return _cap()
  },
  raised: function() {
    var invest = _invest();
    return invest ? _raised(invest) : '...loading...'
  },
  left: function() {
    var invest = _invest();
    return invest ? 42 - _raised(invest) : '...loading...'
  },
  invcap: function() {
    var invest = _invest();
    return invest ? 100 / 3 * _raised(invest) : '...loading...'
  },
  cap_btc_mln: function() {
    var cap = _cap();
    return cap ? cap.btc / 1000000 : '...loading...'
  },
  cap_usd_bln: function() {
    var cap = _cap();
    return cap ? cap.usd / 1000000000 : '...loading...'
  },
  cap_btc_div_200k: function() {
    var cap = _cap();
    return cap ? cap.btc / 200000 : '...loading...'
  },
  nicheShare: function() {
    var invest = _invest(),
      cap = _cap();
    var share = (invest && cap) ? (100 / 3 * _raised(invest) / (cap.btc / 200)) : '...loading...';
    if (_.isString(share)) return "...loading...";
    if (share == 0) return 0;
    var rev = Math.round(1 / share);

    return "1/" + rev
  },
  timeright: function() {
    return Session.get("timeright")
  }
});

Template['ratingPage'].helpers({
  timeright: function() {
    return Session.get("timeright")
  }
});

Template['invest'].events({
  'click .bar': function(e, t) {

  }
});
