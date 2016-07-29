import React, { PropTypes } from 'react'
import { $ } from 'meteor/jquery'
import { If } from '../components/Utils'
import UsersList from '../components/UsersList'
import { Button, Grid, Cell } from 'react-mdl'
import helpers from '../helpers'
import get from 'oget'

// NOTE rename this to UsersStarred?
class StarredBy extends React.Component {

	state = {
				loadUsersList: false,
				showUsersList: false
			}

	toggleUsersList = () => {

		this.setState({
			// on first click load element and never unload it,
			// it's vital for multiple clicks on button.
			loadUsersList: true,
			showUsersList: !this.state.showUsersList
		})

	}

	render() {

		const 	{ state: {showUsersList, loadUsersList}, props: {system, users} } = this,
				displayOrNot = { display: showUsersList ? 'block' : 'none' },
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

								<If condition={loadUsersList}>
									<UsersList users={users} style={displayOrNot} />
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
