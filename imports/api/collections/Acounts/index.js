// mutates asset
import {getPricesById} from '/imports/api/currentData'
function setValues(asset, assetId) {
  var prices = getPricesById(assetId) || {};

  asset.vUsd = (prices.usd || 0) * (asset.quantity || 0);
  asset.vBtc = (prices.btc || 0) * (asset.quantity || 0);
}

var Acounts = new Meteor.Collection("accounts", {

  transform: function(doc) {
    if (doc.addresses) {
      var accBtc = 0;
      var accUsd = 0;
      _.each(doc.addresses, function(assetsDoc, address) {
        var addrUsd = 0;
        var addrBtc = 0;

        if (assetsDoc.assets) {
          _.each(assetsDoc.assets, function(asset, assetId) {

            setValues(asset, assetId);
            addrUsd += asset.vUsd;
            addrBtc += asset.vBtc;
          });
        }

        assetsDoc.vUsd = addrUsd;
        assetsDoc.vBtc = addrBtc;
        accBtc += addrBtc;
        accUsd += addrUsd;
      });

      doc.vBtc = accBtc;
      doc.vUsd = accUsd;
    }
    return doc;
  }

});
module.exports = Acounts
