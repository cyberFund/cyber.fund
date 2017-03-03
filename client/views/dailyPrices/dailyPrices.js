import dailyPrices from '/imports/api/vetalPrices/collection'
Template.dailyPrices.onCreated(function() {
  var instance = this;
  instance.subscribe("dailyPrices");
});

Template.dailyPrices.helpers({
  list: function(){
    return dailyPrices.find().fetch()
  }
})
