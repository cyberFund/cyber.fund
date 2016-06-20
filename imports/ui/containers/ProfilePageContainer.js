import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'
import get from 'oget'
import ProfilePage from '../pages/ProfilePage'

export default ProfilePageContainer = createContainer(() => {
    /*const username = FlowRouter.getParam('username'),
            loaded = Meteor.subscribe('friendlyUsers', {username}).ready() &&
                     Meteor.subscribe('portfolioSystems', {username}).ready() &&
                     Meteor.subscribe('userProfile', {username}).ready() //CF.subs.Assets =

  // TODO get rid of Tracker.autorun
  Tracker.autorun(function() {
        if (CF.UserAssets.graph && CF.UserAssets.graph.folioPie){ //crutch
          CF.UserAssets.graph.folioPie.update({
            labels: [],
            series: []
          })
        }
        if (username) Meteor.call("cfAssetsUpdateBalances", {username})
  })

  Tracker.autorun(function() {
        const user = CF.User.findOneByUsername(username)
        const name = get(user, 'profile.name', username)
        document.title = name + ' - ' + 'cyber•Fund';
  })

    const userAccounts = CF.Accounts.findByRefId(CF.Profile.currentUid()).fetch(),
        profileName = this.profile && this.profile.name, // what is 'this.profile'?
        userRegistracionCount = Session.get("userRegistracionCount"),
        isOwnProfile = !Meteor.userId() ? false :(CF.Profile.currentUsername() == CF.User.username()),
        user = _user()
        /*following  = //whether current user is followed by client user
      var user = Meteor.user();
      if (!Meteor.user()) return false;
      return user.profile && user.profile.followingUsers &&
        _.contains(user.profile.followingUsers, CF.Profile.currentUid())
    ,
    followingCount: function() { //
      var user = _user();
      return user.profile && user.profile.followingUsers && user.profile.followingUsers.length || 0
    },
    starred: function() {
      var user = _user();
      return user.profile && user.profile.starredSystems &&
        CurrentData.find(cfCDs.system(user.profile.starredSystems)) || []
    },
    followingUsers: function() {
      var user = _user();
      return user.profile && user.profile.followingUsers &&
        Meteor.users.find({
          _id: {
            $in: user.profile.followingUsers
          }
        }) || []
    },
    followedByUsers: function() {
      var user = _user();
      return user.profile && user.profile.followedBy &&
        Meteor.users.find({
          _id: {
            $in: user.profile.followedBy
          }
        }) || []
    },
    followedByCount: function() {
      var user = _user();
      return user.profile && user.profile.followedBy && user.profile.followedBy.length || 0
    }
  });*/

  return {loaded: true}
}, ProfilePage)
