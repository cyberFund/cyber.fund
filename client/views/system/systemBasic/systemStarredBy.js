import {CurrentData} from '/imports/api/collections'

function key(){
  return 'showStarredBy';
}

Template['systemStarredBy'].onCreated(function() {
  var instance = this;
  var flag;
  instance.autorun(function() {
    if (Session.get(key()) || flag) {
      var data = CurrentData.findOne({_id: Blaze._globalHelpers._toSpaces(FlowRouter.getParam('name_'))})
      if (data && Session.get('showStarredBy')) {
        instance.subscribe('avatars', data._usersStarred);
      }
      flag = true
    }
  });
});

Template['systemStarredBy'].helpers({
  key: key
})
