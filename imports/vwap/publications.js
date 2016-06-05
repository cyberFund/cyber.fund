// return volume-weighted prices of given fiat (both direct/reverted)
// so client can calculate price relation between bintcoin and given fiat

// fiatName matches xchange feeds fiat name, and in turn equals to system._id
// as it goes in CurrentData collection

Meteor.publish("fiatPair", function(fiatName){
  // if "" is passed, return nothing and (on client) use BTC as a base unit
  if (!fiatName) return this.ready();
  const collection = require("./collections").feedsVwapCurrent
  const selector = require("./selectors").pairsById
  return collection.find(selector(fiatName))
});

Meteor.publish("systemPairsWeighted", function(systemId){
  if (!systemId) return this.ready();
  const collection = require("./collections").feedsVwapCurrent;
  const selector = require("./selectors").pairsById;
  return collection.find(selector(systemId));
});

Meteor.publish("systemPairs", function(systemId){
  if (!systemId) return this.ready();
  const collection = require("./collections").feedsCurrent;
  const selector = require("./selectors").pairsById;
  console.log(selector(systemId))
  console.log(collection.find(selector(systemId)).fetch())
  return collection.find(selector(systemId));
});

Meteor.publish("marketPairs", function(marketUrl){
  if (!marketUrl) return this.ready();
  const collection = require("./collections").feedsCurrent;
  const selector = require("./selectors").pairsByMarket;
  return collection.find(selector(marketUrl));
});
