CF.Profile.currentUid = function() {
  var u = CF.User.findOneByUsername(CF.Profile.currentUsername());
  return u ? u._id : null;
};

CF.Profile.currentUsername = function(){
  return FlowRouter.getParam("username");
};

var helpers = ({
  isOwnAssets: function(){
    return CF.Profile.currentUid() == Meteor.userId();
  }
})

_.each(helpers, function (helper, key) {
  Template.registerHelper(key, helper);
});
