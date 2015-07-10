var currency = new ReactiveVar();
currency.set('usd');

Meteor.startup(function(){
  Meteor.subscribe('fresh-price');
});

Template['btcPrice'].rendered = function () {
  var self = this;
  Tracker.autorun(function () {
    var r = CF.MarketData.btcPriceaLatestDoc();

    if (r && r.metrics)
      $('.dropdown-button').dropdown(/*{
          inDuration: 300,
          outDuration: 225,
          constrain_width: false, // Does not change width of dropdown to that of the activator
          hover: true, // Activate on hover
          gutter: 0, // Spacing from edge
          belowOrigin: false // Displays dropdown below the button
        }*/
      );
  });
};

Template['btcPrice'].helpers({
  'keys': function () {
    //console.log(MarketData);
    var r = CF.MarketData.btcPriceaLatestDoc();
    return _.keys( (r && r.metrics) ? r.metrics.price : {});
  },
  currency: function(){
    return currency.get();
  },
  isSelectedOption: function(key){
    return  (currency.get() == key) ? 'selected': '';
  },
  price: function(){
    var prices = CF.MarketData.btcPriceaLatestDoc();
    if (prices) return Blaze._globalHelpers.readableNumbers( parseFloat(prices.metrics.price[currency.get()]).toFixed(2));
    return ""
  }
});

Template['btcPrice'].events({
  'click .key-select': function (e, t) {
    var val = t.$(e.currentTarget).data("value");
    currency.set(val);
  }
});

Template['btcPriceSimple'].helpers({
  price: function(){
    //var prices = CF.MarketData.btcPriceaLatestDoc();
    var btc = CurrentData.findOne({name: "Bitcoin"});
    if (btc) return Blaze._globalHelpers.readableNumbers( parseFloat(btc.metrics.price.usd).toFixed(2));
    return ""
  }
})