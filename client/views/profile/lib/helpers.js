var helpers = ({
  isOwnAssets: function(){
    return CF.Profile.currentUid() == Meteor.userId();
  }
})

_.each(helpers, function (helper, key) {
  Template.registerHelper(key, helper);
});
