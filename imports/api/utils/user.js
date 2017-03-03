import {normalizeOptionsPerUser} from '/imports/api/utils/index'
import {Meteor} from 'meteor/meteor'
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
  findByUsername: function findByUsername(username) {
    return Meteor.users.findOne({
      "username": username
    });
  },
  idByUsername: function (username) {
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
