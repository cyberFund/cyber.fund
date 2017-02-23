import cfCDs from '/imports/currentData/selectors'

// recalculate raised amount crutch
var print = false ? CF.Utils.logger.print : function() {}
Meteor.startup(function(){
print (Meteor.settings);
})


function updateCrowdsales() {
  var activeCrowdsales = CurrentData.find({
    $and: [cfCDs.crowdsales(), {
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
  }).fetch();
  var length = activeCrowdsales.length;
  var current = 0;
  var interval = Meteor.setInterval(function() {
    if (current < length) {
      var crowdsale = activeCrowdsales[current];
      if (crowdsale.crowdsales) {
        var addr = crowdsale.crowdsales.genesis_address;

        if (addr) {
          if (_.isString(addr)) {
            addr = [addr];
          }
          if (_.isArray(addr)) {
            var raised = {};
            _.each(addr, function(address) {
              var balances = CF.Accounts.quantumCheck(address);
              console.log('---')
              console.log(balances)
              console.log(address)
              console.log('...')
              console.log('')
               //TODO: use imports here.
              if (!balances || balances[0] == 'error') {
                console.log("error")
                console.log("address + CF.Accounts.quantumCheck(address)")
                console.log("results in ")
                console.log("balances")
                return;
              }
              _.each(balances, function(b) {
                if (b.quantity && b.asset) {
                  var val = typeof b.quantity == 'number' ? b.quantity : parseFloat(b.quantity);
                  if (_.has(raised, b.asset)) raised[b.asset] += val;
                  else raised[b.asset] = val;
                }
              })
            });
            console.log('---', raised, '...');
            var sum = 0;
            var date = new Date();
            _.each(raised, function(v, k) {
              var sys = CurrentData.findOne({
                _id: k
              });
              if (sys && sys.metrics && sys.metrics.price && sys.metrics.price.btc) {
                sum += sys.metrics.price.btc * v;
              } else console.log("could not calculate crowdsale correctly, coin ", k, " has no btc price.");
            })
            if (sum) {
              print("crowdsale", crowdsale._id, true);
              print("raised", raised, true);
              print("sum", sum);
              CurrentData.update({
                _id: crowdsale._id
              }, {
                $set: {
                  'metrics.currently_raised': sum,
                  'metrics.currently_raised_full': raised,
                  'metrics.currently_raised_updatedAt': date
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

Meteor.startup(function() {
  updateCrowdsales()
})

if (Meteor.settings.qcCrowdsales) SyncedCron.add({
  name: 'update active crowdsales',
  schedule: function(parser) {
    // parser is a later.parse object
   return parser.cron("8/10 * * * *", false);
  },
  job: function() {
    updateCrowdsales()
  }
});
