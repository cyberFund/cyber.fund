Meteor.methods({
  "patchProfile": function(){
    if (!this.userId) return;
    var user = Meteor.users.findOne({_id: this.userId});
    if (!user) return;
    CF.Profile.patch(user);
  }
});

function biggerTwitterImg(url){
  if (!url) return '';
  return url.replace('_normal', '');
}
// reason for that is user.services.twitter.screenName is delivered by subscriptions,
// while we also want avatar url and name
CF.Profile.patch = function(user){
  if (!user) return;

  var isTwitter = !!(user.services && user.services.twitter)
  var isPassword = !!(user.services && user.services.password) && !isTwitter; // ?

  var set = {}
  if (isTwitter) {
    if (user.username != user.services.twitter.screenName) {
      set["username"] = user.services.twitter.screenName;
    }
    if (user.avatar != user.services.twitter.profile_image_url_https)
    {
      set["avatar"] = user.services.twitter.profile_image_url_https;
      set["largeAvatar"] = biggerTwitterImg(user.services.twitter.profile_image_url_https);
    };
  }
  if (isPassword) {
    set["avatar"] = Gravatar.imageUrl(user.emails[0].address, {
      size: 48,
      default: 'mm' });
    set["largeAvatar"] = Gravatar.imageUrl(user.emails[0].address, {
      size: 480,
      default: 'mm' });
  }

  if (_.keys(set).length)
    Meteor.users.update({_id: user._id}, {$set: set})
};

SyncedCron.add({
  name: 'update profiles',
  schedule: function (parser) {
    return parser.cron('40 * * * *', false);
  },
  job: function () {
    console.log("patching profiles started....")
    Meteor.users.find({}).forEach(function(user){
      CF.Profile.patch(user)
    });
  }
});
