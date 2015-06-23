/**
 * Created by angelo on 6/22/15.
 */
MarketData.allow({
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