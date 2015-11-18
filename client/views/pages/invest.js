Meteor.startup(function () {
  Meteor.setInterval(function () {
    var sT = moment("2016-01-01 00:00:00").diff(moment(), "seconds"),
      s = sT % 60;
    sT = (sT - s) / 60;
    var m = sT % 60;
    sT = (sT - m) / 60;
    var h = sT % 24,
      d = (sT - h) / 24;
    Session.set("timeleft", {
      days: d,
      hours: h,
      minutes: m,
      seconds: s
    })
  }, 1000)
});

Template['invest'].onCreated(function () {
  this.subscribe('investData');
});

Template['invest'].rendered = function () {
  Meteor.call("getInvestData");
  console.log(FlowRouter.current().context.hash);
  var h = FlowRouter.current().context.hash;
  if (h) {
    if ($('#'+ h))
    $('html, body').animate({
      scrollTop: $('#' + h).offset().top
    }, 400);
  }
};

  function _raised(dataobj) {
    return dataobj.final_balance ? dataobj.final_balance / 100000000 : 0
  }

  function _invest() {
    return Extras.findOne({_id: "invest_balance"})
  }

  function _cap() {
    return Extras.findOne({_id: "total_cap"})
  }

  Template['invest'].helpers({
    'invest': function () {
      return _invest();
    },
    'cap': function () {
      return _cap()
    },
    'raised': function () {
      var invest = _invest();
      return invest ? _raised(invest) : 0
    },
    'left': function () {
      var invest = _invest();
      return invest ? 42 - _raised(invest) : 0
    },
    'invcap': function () {
      var invest = _invest();
      return invest ? 100 / 3 * _raised(invest) : 0
    },
    cap_btc_mln: function () {
      var cap = _cap();
      return cap ? cap.btc / 1000000 : 0
    },
    cap_usd_bln: function () {
      var cap = _cap();
      return cap ? cap.usd / 1000000000 : 0
    },
    cap_btc_div_200k: function () {
      var cap = _cap();
      return cap ? cap.btc / 200000 : 0
    },
    'nicheShare': function () {
      var invest = _invest(), cap = _cap();
      var share = (invest && cap) ? (100 / 3 * _raised(invest) / (cap.btc / 200)) : 0;
      if (share == 0) return 0;
      var rev = Math.round(1 / share);

      return "1/" + rev
    },
    'timeleft': function () {
      return Session.get("timeleft")
    }
  });

  Template['ratingPage'].helpers({
    'timeleft': function () {
      return Session.get("timeleft")
    }
  });

  Template['invest'].events({
    'click .bar': function (e, t) {

    }
  });