Accounts.validateNewUser(function (user) {
  if (user.username)
  return (user.username.length >= 6) &&  (!!Meteor.users.findOne({username: user.username}));
  return true;
});

Accounts.onCreateUser(function(options, user) {

  //  TODO: 1. if using twitter:
  //  1.0. username = twitter_id.
  //  1.1. username_exists: Meteor.users.findOne({username: username}
  //  1.2. if ok: add user.username field
  //  1.2.1. if not ok: try same with username+'_tw'
  //  1.2.2. if still not ok: try same with username +'random number or user first/last name'


  var print = CF.Utils.logger.print;

  var isTwitter = !!(user.services && user.services.twitter)

  var username = isTwitter ? user.services.twitter.screenName : (user.username
    || options.username);
  function usernameExists (username) {
    return !!Meteor.users.findOne({username: username})
  }

  if (isTwitter) {
    if (usernameExists(username)) {
      var tests = ['_tw', '_winner', '_1', '_10'];
      if (options.profile && options.profile.name) {
        name = options.profile.name.split(' ');
        if (name[0]) tests.unshift('_'+name[0]);
        if (name[1]) tests.unshift('_'+name[1]);
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

  options.profile = options.profile || {};
  if (isTwitter) {
    options.profile.twitterIconUrl = user.services.twitter.profile_image_url;
    options.profile.twitterIconUrlHttps = user.services.twitter.profile_image_url_https;
    options.profile.twitterName = user.services.twitter.screenName; // obsolete now
  }
  options.profile.firstLogin = true;
  if (options.profile)
    user.profile = options.profile;
  user.firstLogin = true;
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
