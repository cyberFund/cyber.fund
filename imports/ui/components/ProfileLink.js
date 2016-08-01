import React, { PropTypes } from 'react'
import get from 'oget'

// usage example:
// <ProfileLink /> // link to currently logged in user
// or
// <ProfileLink user={someUsersObject} />

const ProfileLink = props => {

	const	avatar = get(props.user, 'avatar', ''),
			username = get(props.user, 'username', '')

	return 	<a href={`/@${username}`} className="mdl-navigation__link" {...props}>
				<img
					src={avatar}
					alt={`${username}'s avatar`}
					className="mdl-list__item-avatar"
					style={{marginRight: '10px'}}
				/>
				{username}
	        </a>

}

ProfileLink.defaultProps = {
	user: Meteor.user()
}

ProfileLink.propTypes = {
	user: PropTypes.object
}

export default ProfileLink
