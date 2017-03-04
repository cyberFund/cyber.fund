import {findByUsername} from '/imports/api/utils/user'
import {Meteor} from 'meteor/meteor'
var cfProfile = {}

cfProfile.currentUsername = function(){
  return FlowRouter.getParam("username");
};

cfProfile.currentUid = function() {
  var u = findByUsername(cfProfile.currentUsername());
  return u ? u._id : null;
};

cfProfile.isOwnAsset = function(){
  return cfProfile.currentUid() == Meteor.userId();
}

module.exports = cfProfile
