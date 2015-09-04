Meteor.methods({
  "patchProfile": function(){
    if (!this.userId) return;
    var user = Meteor.users.findOne({_id: this.userId});
    if (!user) return;
    CF.Profile.patch(user);
  }
});

CF.Profile.patch = function(user){

  if (!user) return;
  if (!user.services.twitter) return;

  var set = {}
  if (user.profile.twitterName != user.services.twitter.screenName) {
    set["profile.twitterName"] = user.services.twitter.screenName;
  }
  if (user.profile.twitterIconUrl != user.services.twitter.profile_image_url)
  {
    set["profile.twitterIconUrl"] = user.services.twitter.profile_image_url;
    set["profile.twitterIconUrlHttps"] = user.services.twitter.profile_image_url_https;
  };
  if (_.keys(set).length)
    Meteor.users.update({_id: this.userId}, {$set: set})
}

SyncedCron.add({
  name: 'update profiles',
  schedule: function (parser) {
    return parser.cron('19 * * * *', false);
  },
  job: function () {
    Meteor.users.find({}).forEach(function(user){
      CF.Profile.patch(user)
    });
  }
})