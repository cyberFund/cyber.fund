import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

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
  transform: function(doc){
    doc._metrics
    return doc;
  }
});

var FastData = new Meteor.Collection("fast_market_data");
var FeedsVwap = require("/imports/api/collections").feedsVwap;
var Metrics = new Meteor.Collection('Metrics')
var Extras = new Meteor.Collection("extras")
var MarketData = new Meteor.Collection("MarketData")

var AddressesLists = new Meteor.Collection("AdressesLists")
var Addresses = new Meteor.Collection("Addresses")


var AcountsHistory = new Meteor.Collection("accountsHistory")
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




module.exports = {
  xchangeCurrent: xchangeCurrent,
  xchangeVwapCurrent: xchangeVwapCurrent,

  CurrentData: CurrentData,
  FastData: FastData,
  Metrics: Metrics,
  Extras: Extras,
  MarketData: MarketData,
  AddressesLists: AddressesLists,
  Addresses: Addresses,

  AcountsHistory: AcountsHistory
}
