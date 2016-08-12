import React, { PropTypes } from 'react'
import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Grid, Cell } from 'react-mdl'
import get from 'oget'
import helpers from '../helpers'
import SystemLink from '../components/SystemLink'

// renders big table with all accounts info

// usage example:
// <PortfolioChart accounts={object} />

// TODO add comments. Nothing is obvious. How does sorting work?
// TODO fix remaining sorting and add onClick animation/styles
// NOTE sorting is already done in portfolioWidgetTable.js, just copy it & modify properly
// TODO do not forget to also implement analytics data submission on sorting event

class PortfolioTable extends React.Component {

	state = { systems: [] }

	// fill table with data on mount
	componentDidMount() { this.getSystems() }

	// this function fetches data and sorts it by setting state.systems
	getSystems = (selector = 'byValue') => { // selector == sorter
		// FIXME this stack of functions is a mess. Refactor, move some to helpers
		//  systems to display in portfolio table, including 'starred' systems

			// dependencies
			const	{ UserAssets } = CF,
					{ selectors } = CF.CurrentData,
					getQuantities = UserAssets.getQuantitiesFromAccountsObject

			// data
			let	accounts = 	this.props.accounts.filter(acc => acc.checked == true),
				systems	 = 	UserAssets.getSystemsFromAccountsObject(accounts)


			if (helpers.isOwnAssets()) {
				var user = Meteor.user(),
					stars = user.profile.starredSystems;
				if (stars && stars.length) {
					systems = _.uniq(_.union(systems, stars));
				}
			}

			var sort = {
				// sort portfolio items by their cost, from higher to lower.
				// return -1 if x > y; return 1 if y > x
				byValue(x, y) {
					var q1 = getQuantities(accounts, x._id);
					var q2 = getQuantities(accounts, y._id);
					return Math.sign(q2 * CF.CurrentData.getPrice(y) - q1 * CF.CurrentData.getPrice(x)) || Math.sign(q2 - q1);
				},
				byAmount(x, y) {
					var q1 = getQuantities(accounts, x._id);
					var q2 = getQuantities(accounts, y._id);
					return Math.sign(q2 - q1);
				},
				byEquity(x, y) {
					var q1 = (x.metrics && x.metrics.supply) ?
					getQuantities(accounts, x._id)/ x.metrics.supply : 0;
					var q2 = (y.metrics && y.metrics.supply) ?
					getQuantities(accounts, y._id) / y.metrics.supply: 0;

					return Math.sign(q2 - q1);
				}
			}

			this.setState({
				systems: 	CurrentData
								.find(selectors.system(systems))
								.fetch()
								.sort(sort[selector])
			})

		// NOTE below code is legacy. I have no idea what the fuck it does.

		// // for sorter values, see template file. 'f|' is for sorting by system field
		// // like "by daily price change", no prefix is for using some sort function
		// // from above
		// var sorter =	CF.Utils._session.get("folioWidgetSort"),
		// 				_sorter = sorter && _.isObject(sorter) && _.keys(sorter) && _.keys(sorter)[0],
		// 				_split = (_sorter || "").split("|");
		//
		// if (_sorter && _split) {
		// 	if (_split.length == 2 && _split[0] == "f") {
		// 		var r = 	CurrentData
		// 					.find(selectors.system(systems))
		// 					.fetch()
		// 					.sort(sort[_split[1]])
		//
		// 		var val = 	sorter
		// 					&& _.isObject(sorter)
		// 					&& _.values(sorter)
		// 					&& _.values(sorter)[0]
		// 		if (val == 1) r = r.reverse()
		// 		return r
		// 	}
		// 	return CurrentData.find(selectors.system(systems), {sort: sorter})
		// }

	}

	render() {
		if(!this.props.accounts) return null

		const 	{ UserAssets } = CF,
				getQuantities = UserAssets.getQuantitiesFromAccountsObject,
				// TODO explain diffrence between tableData and accounts
				tableData = CF.Accounts.portfolioTableData(),
				// accounts array containing only needed data
				accounts = 	this.props.accounts.filter(acc => acc.checked == true),
				{ percents1, readableN0, readableN2, readableN3, readableN4, greenRedNumber } = helpers

		const	assets = CF.Accounts.accumulate(
					accounts.map(account => {
						if(account.checked) return CF.Accounts.extractAssets(account)
				}))

		function quantity(system) {
			if (!system._id) return NaN
			return getQuantities(accounts, system._id)
		}

		function equity(_id, supply, q = 0.0) {
			if (assets[_id]) q = assets[_id] && assets[_id].quantity || 0
			return supply ? 10000 * q / supply : 0.0
		}

		function share(_id) {
			if (_id && assets[_id]) {
				var vBtc 	= 	assets[_id].vBtc
				var sum 	= 	_.reduce(
									_.map(assets, obj => obj.vBtc),
									(memo, num) => memo + num,
									0
								)
				return vBtc / sum
			}
			return 0
		}

		//  TODO implement tooltips (or not?)

	    return  <Grid>
					<Cell col={12} className="table-overflow">
						<table className="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp center" {...this.props}>

							<thead>
								<tr>
									<th className="mdl-data-table__cell--non-numeric text-center">
									    System
									</th>
									<th onClick={this.getSystems.bind(this, 'byAmount')}>Amount</th>
									<th onClick={this.getSystems.bind(this, 'byEquity')}>Equity</th>
									<th>Portfolio Share</th>
									<th onClick={this.getSystems.bind(this, 'byValue')}>Value in BTC</th>
									<th onClick={this.getSystems.bind(this, 'byValue')}>Value in USD</th>
									<th>USD Price<sup>1d Change</sup></th>
									<th>USD Cap</th>
								</tr>
							</thead>

							<tbody>
								{
									this.state.systems.map( system => {

										const	{ _id, metrics } = system,
												supply 	= get(metrics, 'supply', 0),
												usd 	= get(metrics, 'price.usd', 0),
												usdPrice = get(CF.CurrentData.getPricesByDoc(system), 'usd', 0),
												usdPriceChange1d = get(metrics, 'priceChangePercents.day.usd', 0)

										return  <tr key={system._id}>
													<td className="mdl-data-table__cell--non-numeric">
														<SystemLink system={system} />
													</td>
													<td> {readableN2( quantity(system) )} </td>
													<td> {readableN3( equity(_id, supply) )}‱ </td>
													<td> {percents1( share(_id) )} </td>
													<td> {readableN2( get(tableData[system._id], 'vBtc') )} </td>
													<td> {readableN0( get(tableData[system._id], 'vUsd') )} </td>
													<td>
													{readableN2(usdPrice)}
													<sup className={greenRedNumber(usdPriceChange1d)}>
														{readableN2(usdPriceChange1d)}%
													</sup>
													</td>
													<td> {readableN0(supply * usd)} </td>
												</tr>
									})
								}
							</tbody>

						</table>
					</Cell>
		        </Grid>
	}

}

PortfolioTable.propTypes = {
	accounts: PropTypes.object.isRequired
}

export default PortfolioTable
