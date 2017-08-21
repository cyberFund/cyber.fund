import {Meteor} from 'meteor/meteor'
import {selector as _selector} from "/imports/api/userFunds/"

var helpers = {
  userFollowedByCount: function (user) {
    return user && user.profile && user.profile.followedBy &&
    user.profile.followedBy.length || 0;
  },
  userFollowsCount: function (user) {
    return user && user.profile && user.profile.followingUsers &&
    user.profile.followingUsers.length || 0;
  }
};

_.each(helpers, function (helper, key) {
  Template.registerHelper(key, helper);
});

Template.funds.onCreated(function(){
  var instance = this;
  instance.subscribe("usersWithFunds");
});

function fundsIFollow(){
  const userId = Meteor.userId();
  if (!userId) return null;
  const user = Meteor.user();
  let iFollow = user && user.profile && user.profile.followingUsers || [];
  iFollow.push(userId);
  return iFollow
}


Template.funds.helpers({
  rows: function(){
    return Meteor.users.find(_selector, {
      limit: Session.get("showAllUsersAtFunds") ? 1000 : 50,
      sort: {publicFunds: -1}
    });
  },
  rowsIFollow: function(){
    const iFollow = fundsIFollow();
    if (iFollow) {
      selector = {_id: {$in: iFollow}}
      return Meteor.users.find(selector, {
        sort: {publicFunds: -1}
      });
    } else return [];
  },
  rowsIDontFollow: function(){
    const iFollow = fundsIFollow();
    let selector = _.clone(_selector)
    //import {selector} from "/imports/api/userFunds/"
    //let selector = import ("/imports/api/userFunds/").selector
    if (iFollow) selector._id = {$nin: iFollow}
    return Meteor.users.find(selector, {
      limit: Session.get("showAllUsersAtFunds") ? 1000 : 50,
      sort: {publicFunds: -1}
    });
  },

});
