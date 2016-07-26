import React, { PropTypes } from 'react'
import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Grid, Cell } from 'react-mdl'
import helpers from '../helpers'
// import PortfolioChart from './PortfolioChart'

const AccountsTotalTable = props => {
	if(!props.accounts) return null

	const 	assets = CF.Accounts.portfolioTableData()
			// this variables are used in checkboxes and porfolio chart
			// flattenData = CF.Accounts.portfolioTableData(),
			// filteredAccountsData = CF.Accounts.userProfileData(),
			// shouldShowCheckboxes = CF.Accounts.findByRefId(CF.Profile.currentUid()).count() > 1

	function getSum(selector) {

		let sum = 0
		if (_.keys(assets).length) {
		  _.each(assets, asset => sum += asset[selector] || 0)
		}
		return sum

	}

    return  <Grid>
				<Cell col={12} m={4}>

			        <h1 className="text-center">Ƀ {helpers.readableN2(getSum('vBtc'))} </h1>
			        <h2 className="text-center">$ {helpers.readableN0(getSum('vUsd'))} </h2>

					{/* TODO IMPLEMENT CHECKBOXES AND STUFF */}
			        <table className="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp" {...props}>
						<thead>
							<th className="mdl-data-table__cell--non-numeric">
								Account
							</th>
							<th>Σ Ƀ</th>
							<th>Σ $</th>
						</thead>
						<tbody>
							{
								props.accounts.map(account => {
									return 	<tr>
												<td>{account.name}</td>
												<td>{helpers.readableN4(account.vBtc)}</td>
												<td>{helpers.readableN2(account.vUsd)}</td>
											</tr>
								})
							}
						{/*{{#each accountsData}}
							<tr>
							  {{#if shouldShowCheckboxes}}
							    {{#if isOwnAssets}}
							    <td class="left-align ">
							      <input {{showAccount}} type="checkbox" account-id="{{_id}}" id="toggle-account-{{_id}}"
							      class="count-account checkbox-green filled-in"
							         />
							      <label class="grey-text black-text" for="toggle-account-{{_id}}">
							        <i class="tiny grey-text material-icons">{{#if isPrivate}}visibility_off{{else}}visibility{{/if}}</i>
							       </label>
							    </td>
							    <td> {{name}} </td>
							    {{else}}
							    <td>
							      <input {{showAccount}} type="checkbox" account-id="{{_id}}" id="toggle-account-{{_id}}"
							      class="count-account checkbox-green filled-in"
							         />
							      <label class="black-text" for="toggle-account-{{_id}}">{{name}}</label>
							    </td>
							    {{/if}}
							  {{else}}
							    <td> {{name}} </td>
							  {{/if}}
							  <td class="right-align">{{readableN4 vBtc}}</td>
							  <td class="right-align">{{readableN2 vUsd}}</td>
							</tr>
						{{/each}}*/}
						</tbody>
			        </table>
				</Cell>

				<Cell col={12} m={4}>
					{/* TODO implement portfolio chart */}
				    {/*{{> folioChart accountsData=flattenData}}*/}
					{/*<PortfolioChart />*/}
				</Cell>
	        </Grid>
}


AccountsTotalTable.propTypes = {
    accounts: PropTypes.object.isRequired
}

export default AccountsTotalTable
