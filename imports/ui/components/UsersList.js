import React, { PropTypes } from 'react'
import helpers from '../helpers'
import Image from '../components/Image'

const UsersList = props => {
	const users = props.users.map( user => {
		return  <a key={user._id}
					href={`/@${user.username}`}
				   	title={user.username}>
				    <Image src={user.avatar} avatar />
				</a>

	})
    return <div {...props}>{users}</div>
}

UsersList.propTypes = {
 users: PropTypes.array.isRequired
}

UsersList.defaultProps = {
//	users: []
}

export default UsersList
