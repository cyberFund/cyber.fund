Template["testMarkets"].onCreated(function(){
  console.log(Template.currentData().system);
  Meteor.subscribe("xchangeFeeds", {system: system});
});
