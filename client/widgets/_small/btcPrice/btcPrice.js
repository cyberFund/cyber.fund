import {readableN} from '/imports/api/client/utils/base'
import {CurrentData} from '/imports/api/collections'
function _btcPrice (){
  var btc = CurrentData.findOne({_id: "Bitcoin"});
  try {// try to return a value
    return parseFloat(btc.metrics.price.usd);
  } catch (err) {// if value undefined return nothing
    return null;
  }
}

Meteor.startup(function(){
  Meteor.subscribe("bitcoinPrice")
})

Template['btcPriceSimple'].helpers({
  price: function(){ return _btcPrice() }
});
