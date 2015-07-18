/**
 * Created by angelo on 7/17/15.
 */
Meteor.methods({
  getUserNumber: function(){
    var idx=null;
    var uid = this.userId;
    if (!this.userId) return(idx);
    var users = Meteor.users.find({}, {sort: {createdAt: 1}})

    users.forEach(function(doc, index, cursor){
      if (doc._id == uid) idx = index+1;
    })
    return idx
  }
})