import React, { PropTypes } from 'react'
import { $ } from 'meteor/jquery'
import { If } from '../components/Utils'
import UsersList from '../components/UsersList'
import { Button, Grid, Cell } from 'react-mdl'
import helpers from '../helpers'
import get from 'oget'

// TODO rename this to UsersStarred?
class StarredBy extends React.Component {
	constructor(params){
		super(params)
		this.state = {
		  showUsers: false
		}
	}
	toggleUsersList() {
		this.setState({
			showUsers: !this.state.showUsers
		})
	}
	render() {
		const {toggleUsersList, state, props: {system, users}} = this

		return  <Grid>
					<Cell col={12}>
						<If condition={get(system, '_usersStarred.length')}>
							<section className="text-center">
								<Button
									onClick={toggleUsersList.bind(this)}
									component="h5"
									title="click to see users"
									raised ripple>
									  Starred by {system._usersStarred.length} people
								</Button>
								<If condition={state.showUsers}>
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
