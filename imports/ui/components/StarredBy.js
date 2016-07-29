import React, { PropTypes } from 'react'
import { $ } from 'meteor/jquery'
import { If } from '../components/Utils'
import UsersList from '../components/UsersList'
import { Button, Grid, Cell } from 'react-mdl'
import helpers from '../helpers'
import get from 'oget'

// TODO rename this to UsersStarred?
class StarredBy extends React.Component {

	state = {  showUsers: false }

	toggleUsersList = () => {
		this.setState({ showUsers: !this.state.showUsers })
	}

	render() {

		const 	{ state: {showUsers}, props: {system, users} } = this,
				numberOfStars = get(system, '_usersStarred', []).length

		return  <Grid>
					<Cell col={12}>
						<If condition={numberOfStars}>
							<section className="text-center">
								<Button
									onClick={this.toggleUsersList}
									component="h5"
									title="click to see users"
									raised ripple
								>
									  Starred by {numberOfStars} people
								</Button>
								<If condition={showUsers}>
									<UsersList users={users} />
								</If>
							</section>
					    </If>
					</Cell>
				</Grid>
	}
}

StarredBy.propTypes = {
    system: PropTypes.object.isRequired,
	users: PropTypes.array.isRequired
}

export default StarredBy
