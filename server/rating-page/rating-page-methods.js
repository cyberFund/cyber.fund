Meteor.methods({
  toggleStarSys: function (sys) {
    var uid = this.userId;
    if (!uid) return;
    var sel = {_id: uid};
    var user = Meteor.users.findOne(sel)
    if (!user.profile.starredSystems ||
      user.profile.starredSystems.indexOf(sys) == -1) {
      Meteor.users.update(sel, {$push: {'profile.starredSystems': sys}});
      CurrentData.update({system: sys}, {$push: {'_usersStarred': uid}});
    } else {
      Meteor.users.update(sel, {$pull: {'profile.starredSystems': sys}});
      CurrentData.update({system: sys}, {$pull: {'_usersStarred': uid}});
    }
  },
  starSysBySys: function (sys) {
    var uid = this.userId;
    if (!uid) return;
    var sel = {_id: uid};
    var system = CurrentData.findOne(CF.CurrentData.selectors.symbol(sys));
    system = system.system;
    if (system) {
      var user = Meteor.users.findOne(sel)
      if (user) {
        var starred = user.profile.starredSystems;
        if (!starred || starred.indexOf(system.system) == -1) {
          Meteor.users.update(sel, {$push: {'profile.starredSystems': sys}});
          CurrentData.update({system: sys}, {$push: {'_usersStarred': uid}});
        }
      }
    }
  }
});