import dailyPrices from '/imports/api/vetalPrices/collection'
Template.dailyPrices.onCreated(function() {
  this.subscribe("dailyPrices");
});

Template.dailyPrices.helpers({
  list: function(){
    return dailyPrices.find().fetch()
  }
})
