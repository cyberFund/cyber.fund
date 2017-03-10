import {CurrentData} from '/imports/api/collections'
import {listFromIds} from '/imports/api/utils/user'
console.log(listFromIds)
function key(){
  return 'showStarredBy';
}

function _toSpaces(str) {
  return !!str ? str.replace(/_/g, " ") : "";
}

Template['systemStarredBy'].onCreated(function() {
  var instance = this;
  var flag;
  instance.autorun(function() {
    if (Session.get(key()) || flag) {
      var data = CurrentData.findOne({_id: _toSpaces(FlowRouter.getParam('name_'))})
      if (data && Session.get('showStarredBy')) {
        instance.subscribe('avatars', data._usersStarred);
      }
      flag = true
    }
  });
});

Template['systemStarredBy'].helpers({
  key: key,
  usersListFromIds: function(idsList) {
    return listFromIds(idsList);
  }
})
