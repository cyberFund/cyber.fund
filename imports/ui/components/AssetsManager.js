import React, { PropTypes } from 'react'
import { Grid, Cell } from 'react-mdl'
import Account from '../components/Account'

// TODO: rename this into accounts list?

export default class AssetsManager extends React.Component {
	render() {
		
		const { ownerId, accounts } = this.props

		// NOTE no idea what 'owner' property does. Maybe it's a selector, maybe it's for SEO
		return 	<Grid owner={CF.Profile.currentUid() || {}} {...this.props}>
					{
						accounts
						? // render assets
						accounts.map(i => <Account key={i._id} account={i} />)
						: // or empty column
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
