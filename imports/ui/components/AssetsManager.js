import React, { PropTypes } from 'react'
import { Grid, Cell } from 'react-mdl'
import { createContainer } from 'meteor/react-meteor-data'
import Account from '../components/Account'

// TODO: rename this into accounts list?
class AssetsManager extends React.Component {
	render() {
		const { ownerId, accounts } = this.props
		console.log(accounts)
		return 	<Grid owner={ownerId}>
					{
						accounts
						?
						accounts.map(i => <Account key={i._id} account={i} />)
						:
						<Cell col={12}>
							<i className="text-center">There are no assets</i>
						</Cell>
					}
				</Grid>
	}
}

AssetsManager.propTypes = {
	accounts: PropTypes.array.isRequired
}

// NOTE should we merge this into ProfilePageContainer so there will be only one source of data?
// also because it seems like alot of code is duplicated from ProfilePageContainer
export default createContainer(props => {
	const 	ownerId = CF.Profile.currentUid() || {}
	return {
		accounts: CF.Accounts.findByRefId(ownerId).fetch()
	}
}, AssetsManager)
