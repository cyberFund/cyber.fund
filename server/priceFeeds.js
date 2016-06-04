const feeds = require("../imports/vwap/server");
/*Meteor.startup(function(){
  feeds.fetch()
})*/


function doJob1() {
  //feeds.fetchDirect() //todo remove
  var ret = feeds.fetchXchangeData();
  const base = ['market', 'base', 'quote'];
  //const print = CF.Utils.logger.getLogger("xchange fetch").print;

  _.each(ret, function(it) {
    console.log(it);
    let item = _.omit(it._source, base);
    console.log(item);
    console.log(it._source);

    let selector = __.pick(it._source, base);
    console.log(selector)
    selector._id = [it._source.market, it._source.base, it._source.quote].join('_')
    });
    console.log(selector)

    //print("sel", selector, true);
  })
}

SyncedCron.add({
  name: "xchange feed",
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.cron("40 2/3 * * * *", true);
  },
  job: function() {
    doJob1();
  }
})

SyncedCron.add({
  name: "xchange vwap feed",
  schedule: function(parser) {
    return parser.cron("10 1/3 * * * *", true);
  },
  job: function() {
    //const print = CF.Utils.logger.getLogger("xchange-vwap fetch").print;
    var ret = feeds.fetchXchangeVwapData();
    const base = ['base', 'quote'];
    _.each(ret, function(it) {

      let item = _.omit(it._source, base);
      let selector = _.extend(_.pick(it._source, base), {
        _id: [item.base, item.quote].join('_')
      });
      //print("sel", selector, true);
      //print("it", item);
      console.log(item)
    })
  }
})
