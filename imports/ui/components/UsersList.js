import React, { PropTypes } from 'react'
import helpers from '../helpers'
import { Show } from '../components/Utils'
import Image from '../components/Image'

const UsersList = props => {
	return 	<Show condition={props.users} component='section' {...props}>
				<h5>{props.title}</h5>
				{
					props.users.map( user => {
					return  <a key={user._id}
								href={`/@${user.username}`}
								title={user.username}
							>
								<Image src={user.avatar} avatar />
							</a>
					})
				}
				{props.children}
			</Show>
}

UsersList.propTypes = {
	users: PropTypes.array.isRequired,
	title: PropTypes.string.isRequired
}

export default UsersList
