import {CurrentData, Extras} from '/imports/api/collections'
import Acounts from '/imports/api/collections/Acounts'
import {Meteor} from 'meteor/meteor'

function _accounts() {return Acounts.find({refId: Meteor.userId()}).fetch()}

Template["main"].helpers({
  sumBtc: function(){
    var ret = 0;
    if (!Meteor.userId()) return ret;
    let accounts = _accounts();
    accounts.forEach(function (acc){
      ret += acc.vBtc || 0;
    });
    return ret;
  }
});

Template["main"].onCreated(function(){
  let instance = this;
  instance.subscribe("investData");
  instance.subscribe("currentDataRP", {selector: {}, sort:{"calculatable.RATING.sum": -1}, limit: 5} );
  instance.subscribe("usersCount");
  instance.subscribe("crowdsalesActive");
});

Template["mainPageSystemsWidget"].helpers({
  systems: function(){
    return CurrentData.find({}, {sort:{"calculatable.RATING.sum": -1}, limit: 5});
  }
});

Template["mainPageCrowdasalesWidget"].helpers({
  activeCrowdsales: function(){
    return CurrentData.find({
      $and: [{crowdsales: {$exists: true}}, {
        "crowdsales.end_date": {
          $gt: new Date()
        }
      }, {
        "crowdsales.start_date": {
          $lt: new Date()
        }
      }]
    }, {sort: {"crowdsales.end_date": 1}}).fetch();
  }
});
