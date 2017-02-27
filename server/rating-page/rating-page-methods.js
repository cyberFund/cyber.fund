import {CurrentData} from '/imports/api/collections'
Meteor.methods({
  // handles clicking on 'star'
  toggleStarSys: function (sys) {
    var uid = this.userId;
    if (!uid) return;
    var sel = {_id: uid};
    var user = Meteor.users.findOne(sel);
    //var hasPublicAccess = CF.User.hasPublicAccess (user)
    if (!user.profile.starredSystems ||
      user.profile.starredSystems.indexOf(sys) == -1) {
      Meteor.users.update(sel, {$push: {'profile.starredSystems': sys}});
      //if (hasPublicAccess) {
        CurrentData.update({_id: sys},
          {$push: {'_usersStarred': uid}});
      //}
    } else {
      Meteor.users.update(sel, {$pull: {'profile.starredSystems': sys}});
      //if (hasPublicAccess) \\system nippel
      CurrentData.update({_id: sys},
        {$pull: {'_usersStarred': uid}});
    }
    CF.CurrentData.calculatables.triggerCalc ('RATING', sys);
  },

  // is used internally. to star a system when user adds its balance
  starSysBySys: function (sys) {
    var uid = this.userId;
    if (!uid) return;
    var sel = {_id: uid};
    if (sys) {
      var user = Meteor.users.findOne(sel);
      //var hasPublicAccess = CF.User.hasPublicAccess (user)
      if (user) {
        var starred = user.profile.starredSystems;
        if (!starred || starred.indexOf(sys) == -1) {
          Meteor.users.update(sel, {$push: {'profile.starredSystems': sys}});
          //if (hasPublicAccess) {
            CurrentData.update({_id: sys},
              {$push: {'_usersStarred': uid}});
          //}
        }
      }
    }
    CF.CurrentData.calculatables.triggerCalc ('RATING', sys);
  }
});
