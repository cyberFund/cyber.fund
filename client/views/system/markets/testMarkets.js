const markets = require("../../../../imports/vwap/marketsList").xchangeMarkets
const fiats = require("../../../../imports/vwap/marketsList").fiats
  .feedsCurrent
CF.test = CF.test || {}
CF.test.printPairs = function(){
  console.log(xchangeFeeds.find().fetch())
}
Template["testMarkets"].onCreated(function(){
  const system = Template.currentData().system;
  console.log(system);
  console.log(markets);
  console.log(fiats);
  this.autorun(() => {
    this.subscribe("xchangeToSystemPage", {system: system});
  })
});

Template['testMarkets'].helpers({
  pairs: function(){

  }
})
