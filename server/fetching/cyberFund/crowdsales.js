// recalculate raised amount crutch
function updateCrowdsales() {
  var activeCrowdsales = CurrentData.find({
      $and: [CF.CurrentData.selectors.crowdsales(), {
        'crowdsales.end_date': {
          $gt: new Date()
        }
      }, {
        'crowdsales.start_date': {
          $lt: new Date()
        }
      }]
    }, {
      fields: {
        'crowdsales': 1,
        'system': 1
      }
    }).fetch(),
    length = activeCrowdsales.length,
    current = 0,
    interval = Meteor.setInterval(function() {
      if (current < length) {
        var crowdsale = activeCrowdsales[current];
        if (crowdsale.crowdsales) {
          var addr = crowdsale.crowdsales.genesis_address;

          if (addr) {
            if (_.isString(addr)) {
              Meteor.call('cfCheckBalance', addr,
                function(err, ret) {
                  if (!err && ret && ret.length) {
                    var btc = _.find(ret, function(item) {
                      return (item.asset == 'BTC');
                    });
                    var q = btc.quantity;
                    if (!q) return;
                    if (_.isString(q)) {
                      q = parseFloat(q)
                    }
                    console.log('updating raised amount for ' + crowdsale.system);
                    CurrentData.update({
                      _id: crowdsale._id
                    }, {
                      $set: {
                        'metrics.currently_raised': q
                      }
                    })
                  }
                });
            } else {
              if (_.isArray(addr)){
                var sum = {};
                _.each (addr, function(address){
                  var balances = CF.UserAssets.quantumCheck(address);
                  if (!balances || balances[0] == 'error') return;
                  _.each(balances, function(b){
                    if (b.quantity && b.asset) {
                      var val = typeof b.quantity == 'number' ? b.quantity : parseFloat(b.quantity);
                      if (_.has(sum, b.asset)) sum[b.asset] += val;
                      else sum[b.asset] = val;
                    }
                  })
                });
                //currently only btcs
                if (sum['Bitcoin']) // todo: support for more
                  CurrentData.update({
                    _id: crowdsale._id
                  }, {
                    $set: {
                      'metrics.currently_raised': sum['Bitcoin'],
                      'metrics.currently_raised_2': sum
                    }
                  })
              }
            }
          }
        }
        ++current;
      } else {
        Meteor.clearInterval(interval);
      }
    }, 20 * 1000); // 120 seconds per query
}

Meteor.startup(function(){
  updateCrowdsales()
})

SyncedCron.add({
  name: 'update active crowdsales',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 40 minutes');
  },
  job: function() {
    updateCrowdsales()
  }
});
