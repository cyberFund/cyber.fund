function updateCrowdsales() {
  var activeCrowdsales = CurrentData.find({
      $and: [CF.CurrentData.selectors.crowdsales(),
        {'crowdsales.end_date': {$gt: new Date()}},
        {'crowdsales.start_date': {$lt: new Date()}}]
    }, {fields: {'crowdsales': 1, 'system': 1}}).fetch(),
    length = activeCrowdsales.length,
    current = 0,
    interval = Meteor.setInterval(function () {
      if (current < length) {
        var crowdsale = activeCrowdsales[current];
        if (crowdsale.crowdsales) {
          var addr = crowdsale.crowdsales.genesis_address;
          if (addr) {
            Meteor.call('cfCheckBalance', addr,
              function (err, ret) {
                if (!err && ret && ret.length) {
                  var btc = _.find(ret, function (item) {
                    return (item.asset == 'BTC');
                  });
                  var q = btc.quantity;
                  if (!q) return;
                  if (_.isString(q)) {
                    q = parseFloat(q)
                  }
                  console.log('updating raised amount for ' + crowdsale.system);
                  CurrentData.update({_id: crowdsale._id},
                    {$set: {'metrics.currently_raised': q}})
                }
              });
          }
        }
        ++current;
      }
      else {
        Meteor.clearInterval(interval);
      }
    }, 120*1000); // 120 seconds per query
}

SyncedCron.add({
  name: 'update active crowdsales',
  schedule: function (parser) {
    // parser is a later.parse object
    return parser.text('every 10 minutes');
  },
  job: function () {
    updateCrowdsales()
  }
});
