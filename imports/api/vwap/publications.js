// return volume-weighted prices of given fiat (both direct/reverted)
// so client can calculate price relation between bintcoin and given fiat

// fiatName matches xchange feeds fiat name, and in turn equals to system._id
// as it goes in CurrentData collection

import {xchangeVwapCurrent, xchangeCurrent} from '/imports/api/collections'
import { byId, byTwoIds, byMarket } from './selectors/tradePairs'

Meteor.publish("fiatPair", function(fiatName){
  // if "" is passed, return nothing and (on client) use BTC as a base unit
  if (!fiatName) return this.ready();
  return xchangeVwapCurrent.find(byId(fiatName))
});

Meteor.publish("systemPairsWeighted", function(systemId){
  if (!systemId) return this.ready();
  return xchangeVwapCurrent.find(byId(systemId));
});

Meteor.publish("systemPairs", function(systemId){
  if (!systemId) return this.ready();
  return xchangeCurrent.find(byId(systemId));
});

Meteor.publish("systemPairsToBitcoinWeighted", function(systemId){
  if (!systemId) return this.ready();
  const collection = require("./collections").xchangeVwapCurrent;
  const selector = require("./selectors").pairsByTwoIds;
  return xchangeVwapCurrent.find(selector(systemId));
});

Meteor.publish("pairsToBitcoinWeighted", function(){
  const collection = require("./collections").xchangeVwapCurrent;
  const selector = require("./selectors").pairsById;
  return collection.find(pairsById("Bitcoin"));
});


Meteor.publish("marketPairs", function(marketUrl){
  if (!marketUrl) return this.ready();
  const collection = require("./collections").xchangeCurrent;
  const selector = require("./selectors").pairsByMarket;
  return collection.find(selector(marketUrl));
});
