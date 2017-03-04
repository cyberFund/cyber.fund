import {_session} from '/imports/api/client/utils/base'
import {Meteor} from 'meteor/meteor'
Meteor.startup(function () {
  _session.default("fiat", "USD");
});

Meteor.autorun(function(){
  Meteor.subscribe("fiatPair", _session.get("fiat"));
});
