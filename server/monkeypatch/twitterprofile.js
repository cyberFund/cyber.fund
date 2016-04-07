Meteor.methods({
  "patchProfile": function(){
    if (!this.userId) return;
    var user = Meteor.users.findOne({_id: this.userId});
    if (!user) return;
    CF.Profile.patch(user);
  }
});


// reason for that is user.services.twitter.screenName is delivered by subscriptions,
// while we also want avatar url and name
CF.Profile.patch = function(user){
  if (!user) return;
  if (!user.services.twitter) return;
  var set = {}
  if (user.profile.twitterName != user.services.twitter.screenName) {
    set["profile.twitterName"] = user.services.twitter.screenName;
  }
  if (user.profile.twitterIconUrlHttps != user.services.twitter.profile_image_url_https)
  {
    set["profile.twitterIconUrl"] = user.services.twitter.profile_image_url;
    set["profile.twitterIconUrlHttps"] = user.services.twitter.profile_image_url_https;
  };
  if (_.keys(set).length)
    Meteor.users.update({_id: user._id}, {$set: set})
};

SyncedCron.add({
  name: 'update profiles',
  schedule: function (parser) {
    return parser.cron('19 * * * *', false);
  },
  job: function () {
    Meteor.users.find({"services.twitter": {$exists: true}}).forEach(function(user){
      CF.Profile.patch(user)
    });
  }
});


Meteor.startup(function(){ //could not do this from mongo shell..
  ids = Meteor.users.find({"profile.twitterName": {$exists: true},
    'username': {$exists: false}}, {fields: {_id: 1, "profile.twitterName": 1} })
  .fetch()
  console.log(ids)
  ids.forEach(function(id){
    Meteor.users.update({_id: id._id}, {$set: {username: id.profile.twitterName}})
  })
})
