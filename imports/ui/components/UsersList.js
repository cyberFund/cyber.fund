import React, { PropTypes } from 'react'
import helpers from '../helpers'
import Image from '../components/Image'
import Loading from '../components/Loading'

const UsersList = props => {
	const users = props.users.map( user => {
		return  <a key={user._id}
					href={`/@${user.username}`}
				   	title={user.username}>
				    <Image src={user.avatar} avatar />
				</a>
	})
    return props.loaded ? <div {...props}>{users}</div> : <Loading />
}
// TODO do we need loading here?
UsersList.defaultProps = {
	loaded: true
}

UsersList.propTypes = {
 users: PropTypes.array.isRequired,
 loaded: PropTypes.bool
}

export default UsersList
