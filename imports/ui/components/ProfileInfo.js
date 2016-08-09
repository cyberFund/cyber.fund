import React from 'react'
import PortfolioTable from '../components/PortfolioTable'
import PortfolioChart from '../components/PortfolioChart'
import AccountsTotalTable from '../components/AccountsTotalTable'

// components in render section all use same data which changes on user clicks
// this component was created to manage this data
// Plus, managing this data in container was not straight forwar
// thats why state manipulation is used.

// usage example:
// <PortfolioChart accounts={object} />

class ProfileInfo extends React.Component {

	// add checked = true property to all accounts
	// (all accounts should be visible in table by default)
	constructor(params) {
		super(params)

		this.props.accounts.forEach(acc => acc.checked = true)
		this.state = { accounts: this.props.accounts }

	}

	// toggleAccount(object) == toggles account.checked property
	// toggleAccount(boolean) == toggles ALL accounts "checked" property
	toggleAccount = account => {

		let { accounts } = this.state

		if (typeof account == 'boolean') {
			accounts.forEach(acc => acc.checked = !account)
		}
		else {
			accounts[accounts.indexOf(account)].checked = !account.checked
		}

		this.setState({ accounts })

	}

	render() {
		const 	{ state: {accounts}, toggleAccount } = this,
				// extract assets from account
				// this is needed everytime anything changes,
				// that's why it's done in render() method
				assets = CF.Accounts.accumulate(
					accounts.map(account => {
						if(account.checked) return CF.Accounts.extractAssets(account)
				}))

		return 	<div>
					<AccountsTotalTable accounts={accounts} assets={assets} callback={toggleAccount} />
					<PortfolioChart assets={assets} />
					<PortfolioTable accounts={accounts} />
				</div>
	}

}

export default ProfileInfo
