import {CurrentData} from '/imports/api/collections'
import calculatables from '/imports/api/server/calculatables'

Meteor.methods({
  // handles clicking on 'star'
  toggleStarSys: function (sys) {
    var userId = this.userId;
    if (!userId) return;
    var sel = {_id: userId};
    var user = Meteor.users.findOne(sel);

    if (!user.profile.starredSystems ||
      user.profile.starredSystems.indexOf(sys) == -1) {
      Meteor.users.update(sel, {$push: {'profile.starredSystems': sys}});

        CurrentData.update({_id: sys},
          {$push: {'_usersStarred': userId}});

    } else {
      Meteor.users.update(sel, {$pull: {'profile.starredSystems': sys}});
      CurrentData.update({_id: sys},
        {$pull: {'_usersStarred': userId}});
    }
    calculatables.triggerCalc ('RATING', sys);
  },

  // is used internally. to star a system when user adds its balance
  starSysBySys: function (sys) {
    var userId = this.userId;
    if (!userId) return;
    var sel = {_id: userId};
    if (sys) {
      var user = Meteor.users.findOne(sel);
  //PRIVACY
      if (user) {
        var starred = user.profile.starredSystems;
        if (!starred || starred.indexOf(sys) == -1) {
          Meteor.users.update(sel, {$push: {'profile.starredSystems': sys}});

            CurrentData.update({_id: sys},
              {$push: {'_usersStarred': userId}});

        }
      }
    }
    calculatables.triggerCalc ('RATING', sys);
  }
});
