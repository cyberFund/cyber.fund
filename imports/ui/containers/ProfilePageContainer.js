import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { FlowRouter } from 'meteor/kadira:flow-router'
import get from 'oget'
import ProfilePage from '../pages/ProfilePage'

export default ProfilePageContainer = createContainer(() => {
	// constants
    const username = FlowRouter.getParam('username'),
			user = CF.User.findOneByUsername(username) || {},
			name = get(user, 'profile.name', username),
			// subscriptions ready state should not be qued,
			// do not use loaded = sub1.ready() && sub2.ready()
            usersReady = 	 Meteor.subscribe('friendlyUsers', {username}).ready(),
            systemsReady = 	 Meteor.subscribe('portfolioSystems', {username}).ready(),
            protfolioReady = Meteor.subscribe('userProfile', {username}).ready()

    // TODO refactoring, add comments

	if (CF.UserAssets.graph && CF.UserAssets.graph.folioPie) { //crutch
	  CF.UserAssets.graph.folioPie.update({
	    labels: [],
	    series: []
	  })
	}
	if (username) Meteor.call("cfAssetsUpdateBalances", {username})
	document.title = name + ' - ' + 'cyber•Fund'

	// TODO which constants are actually used and which are not?
	//profileName = this.profile && this.profile.name
  return {
		user,
		loaded: usersReady && systemsReady && protfolioReady,
		userAccounts: CF.Accounts.findByRefId(user._id).fetch(),
		userNumber: Session.get("userRegistracionCount"),
		isOwnProfile: Meteor.userId() ? (CF.Profile.currentUsername() == CF.User.username()) : false,
		starred: CurrentData.find(
			CF.CurrentData.selectors.system(
				get(user, 'profile.starredSystems', [])
			)
		).fetch(),
		followingUsers: Meteor.users.find({
			    _id: {
			      $in: get(user, 'profile.followingUsers', [])
			    }
			}).fetch(),
		followedByUsers: Meteor.users.find({
			    _id: {
			      $in: get(user, 'profile.followedBy', [])
			    }
			}).fetch(),
		//followingCount: get(user, 'profile.followingUsers.length', 0),
		//followedByCount: get(user, 'profile.followedBy', 0),
		//check if current user is following this profile
		following: _.contains(get(Meteor.user(), 'profile.followingUsers') || [], user._id)
  }
}, ProfilePage)
