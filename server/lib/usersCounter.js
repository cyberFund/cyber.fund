/**
 * Created by angelo on 7/17/15.
 */
Meteor.methods({
  getUserNumber: function(){
    var idx=null;
    if (!this.userId) return(idx);
    var user = Meteor.users.findOne({_id: this.userId});
    idx = user && user.registerNumber || null;
    return idx
  }
})
