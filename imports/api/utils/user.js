import {Meteor} from 'meteor/meteor'

var exp = {
  username: function() {
    var user = Meteor.user();
    if (!user) return '';
    return (user.username) || '';
  },
  linkToOwnProfile:  function() {
    var username = this.username();
    return username ? '/@' + username : '/welcome'
  },
  listFromIds: function (list) {
    return Meteor.users.find({
      _id: {
        $in: list
      }
    });
  },
  findByUsername: function (username) {
    return Meteor.users.findOne({
      "username": username
    });
  },
  idByUsername: function (username) {
    var r =  Meteor.users.findOne({
      "username": username
    });
    return r ? r._id : null
  },
  selectors: {
    userByUsername: function (username) {
      return ({
        "username": username
      });
    }
  }
}

module.exports = exp;
