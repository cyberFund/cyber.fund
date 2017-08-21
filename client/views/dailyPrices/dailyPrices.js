import dailyPrices from '/imports/api/dailyPrices/collection'
Template.dailyPrices.onCreated(function() {
  var instance = this;
  instance.subscribe("dailyPrices");
});

Template.dailyPrices.helpers({
  list: function(){
    return dailyPrices.find().fetch()
  }
})
