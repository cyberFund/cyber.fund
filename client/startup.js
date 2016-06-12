Meteor.startup(function () {
  CF.Utils._session.default("fiat", "");
});

Meteor.autorun(function(){
  Meteor.subscribe("fiatPair", CF.Utils._session.get("fiat"));
});
