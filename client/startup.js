import _session from '/imports/api/client/cfUtils/_session'
Meteor.startup(function () {
  _session.default("fiat", "");
});

Meteor.autorun(function(){
  Meteor.subscribe("fiatPair", _session.get("fiat"));
});
