Template['btcPriceSimple'].helpers({
  price: function(){
    var btcPrice  =  Blaze._globalHelpers._btcPrice()
    if (btcPrice) return Blaze._globalHelpers.readableNumbers( btcPrice );
    return ''
  }
});
