var ns = CF.Accounts;
ns.collection = new Meteor.Collection('accounts');
var print = Meteor.isClient ? function(){} : CF.Utils.logger.getLogger('CF.Accounts').print;
var _k = CF.Utils._k

ns.collection.allow({
  insert: function(userId, doc){
    return false;
    return userId && (doc.refId == userId);
  },
  update: function(userId, doc, fieldNames, modifier){
    return false;
    if (fieldNames['refId'] || fieldNames['value'] || fieldNames['createdAt']) return false;
    if (doc.refId != userId) return false;
    return true;
  },
  remove: function(userId, doc){
    return doc.refId == userId;
  }
});

ns._findByUserId = function(userId, options){
  var selector = {
    refId: userId,
  }

  // have to supply isPrivate flag internally on server
  if (Meteor.isServer && !options.private) _.extend (selector, {isPrivate: {$ne: true}})
  return ns.collection.find(selector);
}

ns.findById = function(_id, options){
  if (!_id) return {};
  options = options || {};
  var selector = {_id: _id}
  //if (Meteor.isServer) {} && !options.private)
  //  _.extend (selector, {isPrivate: {$ne: true}})
  return ns.collection.findOne(selector);
}

var checkAllowed = function(accountKey, userId){ // TODO move to collection rules
  if (!userId) return false;
  var account = CF.Accounts.collection.findOne({_id: accountKey, refId: userId});
  return account;
}
