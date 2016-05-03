var ns = CF.Accounts;
ns.collection = new Meteor.Collection('accounts');


ns.collection.allow({
  insert: function(userId, doc){
    return false
  },
  update: function(userId, doc, fieldNames, modifier){
    return false;
  },
  remove: function(userId, doc){
    return false;
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
  if (Meteor.isServer && !options.private) 
    _.extend (selector, {isPrivate: {$ne: true}})
  return ns.collection.findOne(selector);
}
