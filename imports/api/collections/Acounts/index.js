import {Mongo} from 'meteor/mongo'
var Acounts = new Mongo.Collection("accounts", {

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

Acounts.allow({
  insert: function(userId, doc) {
    return userId && (doc.refId == userId);
  },
  update: function(userId, doc, fieldNames, modifier) {
    if (fieldNames["refId"] || fieldNames["value"] || fieldNames["createdAt"]) return false;
    if (doc.refId != userId) return false;
    return true;
  },
  remove: function(userId, doc) {
    return doc.refId == userId;
  }
});
if (Meteor.isServer) {
  Acounts._ensureIndex({
    refId: 1
  })
}
module.exports = {
  Acounts: Acounts,
}
