CF.MarketData.graphTime = new CF.Utils.SessionVariable("CF.MarketData.graphTime");
Meteor.startup(function(){
  if (!Session.get('CF.MarketData.graphTime')) CF.MarketData.graphTime.set("all");
});