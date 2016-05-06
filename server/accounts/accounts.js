Accounts.validateNewUser(function (user) {
  if (user.username)
  return (user.username.length >= 4) &&  (!Meteor.users.findOne({username: user.username}));
  return true;
});

Accounts.onCreateUser(function(options, user) {

  //  1. if using twitter:
  //  1.0. username = twitter_id.
  //  1.1. username_exists: Meteor.users.findOne({username: username}
  //  1.2. if ok: add user.username field
  //  1.2.1. if not ok: try same with username+'_tw'
  //  1.2.2. if still not ok: try same with username +'random number or user first/last name'
  //
  //   and that s completely wrong.

  var isTwitter = !!(user.services && user.services.twitter)
  var isPassword = !!(user.services && user.services.password) && !isTwitter; // ?

  var username = isTwitter ? user.services.twitter.screenName : (user.username
    || options.username);

  function usernameExists (username) {
    return !!Meteor.users.findOne({username: username})
  }

  if (isTwitter) {
    if (usernameExists(username)) {
      var tests = ['_tw', '_winner', '_1', '_10'];
      if (options.profile && options.profile.name) {
        var name = options.profile.name.split(' ');
        if (name[1]) tests.unshift('_'+name[1]);
        if (name[0]) tests.unshift('_'+name[0]);
      }
      var tail = _.find(tests, function(tail){
        return !usernameExists(username+tail)
      });
      username = username + tail;
    }
  } else {
    if (usernameExists(username)) {
      throw ("failure")
    }
  }

  user.username = username;
  function biggerTwitterImg(url){
    if (!url) return '';
    return url.replace('_normal', '');
  }
  options.profile = options.profile || {};
  if (isTwitter) {
    user.avatar = user.services.twitter.profile_image_url_https;
    user.username = user.services.twitter.screenName; // obsolete now
    user.largeAvatar = biggerTwitterImg(user.services.twitter.profile_image_url_https);
  }
  if (isPassword) {
    user.avatar = Gravatar.imageUrl(user.emails[0].address, {
      size: 48,
      default: 'mm' });
    user.largeAvatar = Gravatar.imageUrl(user.emails[0].address, {
      size: 480,
      default: 'mm' });
  }
  options.profile.firstLogin = true;
  if (options.profile)
    user.profile = options.profile;
  user.firstLogin = true;
  user.registerNumber = Meteor.users.find().count() + 1
  return user;
});

// this flag is used by client to call analytics signup track
Meteor.methods({
  afterFirstLogin: function(){
    if (!Meteor.userId()) return;
    Meteor.users.update({
      _id: Meteor.userId()
    },{$unset: {'firstLogin': true}})
  }
});
