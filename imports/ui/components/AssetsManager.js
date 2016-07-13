import React, { PropTypes } from 'react'
import { Grid, Cell, Icon, Button, Tabs, Tab } from 'react-mdl'
import { createContainer } from 'meteor/react-meteor-data'
import { _ } from 'meteor/underscore'
import { If } from '../components/Utils'
import ChaingearLink from '../components/ChaingearLink'
import Account from '../components/Account'
import helpers from '../helpers'

class AssetsManager extends React.Component {
	render() {
		const { ownerId, accounts } = this.props
		console.log(ownerId)
		console.log(accounts)
		return 	<Grid owner={ownerId}>
					{
						accounts
						? accounts.map( i => <Account key='ad' /> )
						: <p className="text-center">
							<i>There are no assets</i>
						  </p>
					}
				</Grid>
	}
}

export default createContainer(props => {

	var ns = CF.Accounts
	ns.currentId = new CF.Utils.SessionVariable("cfAccountsCurrentId")

	const 	ownerId = CF.Profile.currentUid(),
			accounts =	CF.Accounts.findByRefId(ownerId).fetch()

	return {
		ownerId: ownerId ? ownerId : {},
		accounts: accounts ? accounts : []
	}

}, AssetsManager)

AssetsManager.propTypes = {
	ownerId: PropTypes.string.isRequired,
	accounts: PropTypes.array.isRequired
}

export default AssetsManager
