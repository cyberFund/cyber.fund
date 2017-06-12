import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { feedsVwap } from '/imports/api/collections'

// currently, actual state only. history is stored in outer (non meteor) db

// current/last states. taken from es currently
var xchangeCurrent = new Mongo.Collection("xchangeCurrent");
// volume weighted - current/last states. taken from es currently
var xchangeVwapCurrent = new Mongo.Collection("xchangeVwapCurrent");

// those are readonly for clients
xchangeCurrent.allow({
  insert: function(){return false;},
  update: function(){return false;},
  remove: function(){return false;}
});

xchangeVwapCurrent.allow({
  insert: function(){return false;},
  update: function(){return false;},
  remove: function(){return false;}
});


var CurrentData = new Meteor.Collection("CurrentData", {

});

const FastData = new Mongo.Collection("fast_market_data");
const FeedsVwap = feedsVwap;
const Metrics = new Mongo.Collection('Metrics')
const Extras = new Mongo.Collection("extras")
const MarketData = new Mongo.Collection("MarketData")

const AddressesLists = new Mongo.Collection("AdressesLists")
var Addresses = new Mongo.Collection("Addresses")

var AcountsHistory = new Mongo.Collection("accountsHistory")
if (Meteor.isServer) {
  AcountsHistory._ensureIndex({
    timestamp: -1
  });
  AcountsHistory._ensureIndex({
    refId: 1, timestamp: -1
  });
  AcountsHistory._ensureIndex({
    accountId: 1, timestamp: -1
  });
}
AcountsHistory.allow({
  insert: function(userId, doc) {return false;},
  update: function(userId, doc, fieldNames, modifier) {  return false;  },
  remove: function(userId, doc) {    return false;  }
});

export {
  xchangeCurrent,
  xchangeVwapCurrent,

  CurrentData,
  FastData,
  Metrics,
  Extras,
  MarketData,
  AddressesLists,
  Addresses,

  AcountsHistory
}
