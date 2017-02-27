//TODO: bind to template

Meteor.autorun(function(){
  Meteor.subscribe("fiatPair", _session.get("fiat"));
});
