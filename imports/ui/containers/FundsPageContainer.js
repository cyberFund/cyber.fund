import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import { selector } from "../../api/userFunds/index"
import FundsPage from '../pages/FundsPage'
import get from 'oget'

export default FundsPageContainer = createContainer(() => {
	const 	user = Meteor.user(),
			loaded = Meteor.subscribe("usersWithFunds").ready(),
			sort = {
				publicFunds: -1,
				'profile.followedBy': -1
			}

	let iFollow = get(user, 'profile.followingUsers', [])

	if (user) iFollow.push(user._id)

	function fundsIfollow() {
		if (iFollow) {
			return 	Meteor.users.find(
						{ _id: { $in: iFollow } },
						{ sort }
					).fetch()
		}
		else return []
	}

	function fundsIdontFollow() {
		if (iFollow) selector._id = {$nin: iFollow}
		return Meteor.users.find(selector, {
			sort,
			limit: Session.get("showAllUsersAtFunds") ? 1000 : 50
		}).fetch()
	}

	return {
		loaded,
		fundsIfollow: fundsIfollow(),
		fundsIdontFollow: fundsIdontFollow()
	}
}, FundsPage)
