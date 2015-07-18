Meteor.methods({
  "patchProfile": function(){
    if (!this.userId) return;
    var user = Meteor.users.findOne({_id: this.userId});
    if (!user.services.twitter) return;
    var set = {
      "profile.twitterName": user.services.twitter.screenName,
      "profile.twitterIconUrl": user.services.twitter.profile_image_url
    };
    Meteor.users.update({_id: this.userId}, {$set: set})
  }
});