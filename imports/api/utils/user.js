import {normalizeOptionsPerUser} from '/imports/api/utils'
module.exports = {
  username: function() {
    var user = Meteor.user();
    if (!user) return '';
    return (user.username) || '';
  },
  isSelf: function(options) {
    options = normalizeOptionsPerUser(options);
    return options.userId == this.userId;
  },
  linkToOwnProfile:  function() {
    var username = this.username();
    return username ? '/@' + username : '/welcome'
  },
  listFromIds: function getUsersByIds(listFromIds) {
    return Meteor.users.find({
      _id: {
        $in: listFromIds
      }
    });
  },
  findOneByUsername: function findOneByUsername(username) {
    return Meteor.users.findOne({
      "username": username
    });
  },
  idByUsername: function idByUsername(username) {
    var r = this.findOneByUsername(username);
    return r ? r._id : null
  },
  selectors: {
    userByUsername: function userByUsername(username) {
      return ({
        "username": username
      });
    }
  }
}
