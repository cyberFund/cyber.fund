import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import StarredBy from '../components/StarredBy'

export default StarredByContainer = createContainer( props => {

	const loaded = Meteor.subscribe('avatars', props.system._usersStarred).ready()
	const users = Meteor.users.find({
				'profile.starredSystems': props.system._id
		}).fetch()

	return { loaded, users }
}, StarredBy)
