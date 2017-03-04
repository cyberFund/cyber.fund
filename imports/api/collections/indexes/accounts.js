import Acounts from '/imports/api/collections/Acounts'
import {Meteor} from 'meteor/meteor'

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
