import React, { PropTypes } from 'react'
import { Grid, Cell } from 'react-mdl'
import { _ } from 'meteor/underscore'
import helpers from '../helpers'
import get from 'oget'
import Checkbox from 'material-ui/Checkbox'

// displays headers with total sums of all accounts
// and table with all assets(systems) used in said accounts

// usage example:
// <AccountsTotalTable accounts={object} assets={array} callback={function} />
// callback() toggles display of account or all accounts

class AccountsTotalTable extends React.Component {

	render() {
		const 	{ props: {accounts, assets, callback}, state } = this,
				{ readableN4, readableN2, readableN0 } = helpers,
				nonNumeric = "mdl-data-table__cell--non-numeric",
				allAccountsChecked = accounts.every(acc => acc.checked)

		// returns total amount of selected values (btc or usd)
		function getSum(selector, sum = 0) {
			_.each(assets, (asset) => {
				sum += asset[selector] || 0
			})
			return sum
		}

		return	<Grid>
					<Cell col={12} m={4} className="table-overflow">

						{/* HEADERS */}
						<h1 className="text-center">Ƀ {readableN2(getSum('vBtc'))} </h1>
						<h2 className="text-center">$ {readableN0(getSum('vUsd'))} </h2>

						{/* TABLE */}
						<table className="mdl-data-table mdl-js-data-table mdl-data-table--selectable">
							<thead>
								{/* toggle all accounts on click */}
								{/* if boolean passed to callback() all account ill be toggled */}
								<tr onClick={callback.bind(this, allAccountsChecked)}>
									<th className={nonNumeric}> <Checkbox checked={allAccountsChecked} /> </th>
									<th className={nonNumeric}>Account</th>
									<th>Σ Ƀ</th>
									<th>Σ $</th>
								</tr>
							</thead>

							<tbody>
								{
									accounts.map( account => {
										return (
											// toggle single account on row click
											<tr
												onClick={callback.bind(this, account)}
												key={account._id}
												// dataMdlDataTableSelectableName="accounts[]"
												// dataMdlDataTableSelectableValue={account._id}
											>
												<td className={nonNumeric}> <Checkbox checked={account.checked} /> </td>
												<td className={nonNumeric}> {get(account, 'name', '')} </td>
												<td> {readableN4(get(account, 'vBtc', 0))} </td>
												<td> {readableN2(get(account, 'vUsd', 0))} </td>
											</tr>
										)
									})
								}
							</tbody>
						</table>
					</Cell>
				</Grid>

	}

}

AccountsTotalTable.propTypes = {
	accounts: PropTypes.object.isRequired,
	assets: PropTypes.array.isRequired,
	// function to call on row click
	// this toggles display of account
    callback: PropTypes.func
}

export default AccountsTotalTable
