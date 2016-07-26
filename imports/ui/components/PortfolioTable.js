import React, { PropTypes } from 'react'
import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Grid, Cell } from 'react-mdl'
import get from 'oget'
import helpers from '../helpers'
import Image from '../components/Image'

// TODO implement sorting
// NOTE sorting is already done in portfolioWidgetTable.js, just copy it & modify properly
// TODO do not forget to also implement analytics data submission on sorting event

const PortfolioTable = props => {

	if(!props.accounts) return null

	// NOTE remove this accounts fetching process and just pass accounts throw container?
	const 	ns = CF.UserAssets,
			{ selectors } = CF.CurrentData,
			r = CF.Accounts.portfolioTableData(),
			accounts =  CF.Accounts.userProfileData(),
			{ percents1, readableN0, readableN2, readableN3, readableN4, greenRedNumber } = helpers

	// FIXME this stack of functions is a mess. Refactor, move some to helpers
	function getSystems() { //  systems to display in portfolio table, including 'starred' systems

		       var systems = ns.getSystemsFromAccountsObject(accounts);

		       if (helpers.isOwnAssets()) {
		         var user = Meteor.user();
		         var stars = user.profile.starredSystems;
		         if (stars && stars.length) {
		           systems = _.uniq(_.union(systems, stars));
		         }
		       }

		       var sort = {
		         // sort portfolio items by their cost, from higher to lower.
		         // return -1 if x > y; return 1 if y > x
		         byValue: function (x, y) {
		           var q1 = ns.getQuantitiesFromAccountsObject(accounts, x._id);
		           var q2 = ns.getQuantitiesFromAccountsObject(accounts, y._id);
		           return Math.sign(q2 * CF.CurrentData.getPrice(y) - q1 * CF.CurrentData.getPrice(x)) || Math.sign(q2 - q1);
		         },
		         byAmount: function (x, y) {
		           var q1 = ns.getQuantitiesFromAccountsObject(accounts, x._id);
		           var q2 = ns.getQuantitiesFromAccountsObject(accounts, y._id);
		           return Math.sign(q2 - q1);
		         },
		         byEquity: function (x, y) {
		           var q1 = (x.metrics && x.metrics.supply) ?
		             ns.getQuantitiesFromAccountsObject(accounts, x._id)/ x.metrics.supply : 0;
		           var q2 = (y.metrics && y.metrics.supply) ?
		             ns.getQuantitiesFromAccountsObject(accounts, y._id) / y.metrics.supply: 0;

		           return Math.sign(q2 - q1);
		         }
		       };

		       // for sorter values, see template file. 'f|' is for sorting by system field
		       // like "by daily price change", no prefix is for using some sort function
		       // from above
		       var sorter = CF.Utils._session.get("folioWidgetSort"),
		         _sorter = sorter && _.isObject(sorter) && _.keys(sorter) && _.keys(sorter)[0],
		         _split = (_sorter || "").split("|");

		       if (_sorter && _split) {
		         if (_split.length == 2 && _split[0] == "f") {
		           var r = CurrentData.find(selectors.system(systems))
		             .fetch()
		             .sort(sort[_split[1]]);

		           var val = sorter && _.isObject(sorter) && _.values(sorter)
		             && _.values(sorter)[0];
		           if (val == 1) r = r.reverse();
		           return r;
		         }
		         return CurrentData.find(selectors.system(systems), {sort: sorter});
		       }

		       return CurrentData.find(selectors.system(systems))
		         .fetch().sort(sort.byValue);
     }

	 function quantity(system) {
       if (!system._id) return NaN;
       return ns.getQuantitiesFromAccountsObject(accounts, system._id);
     }

     function btcCost(system) {
       return r && r[system._id] && r[system._id].vBtc;
       if (!system.metrics || !system.metrics.price || !system.metrics.price.btc) return "no btc price found..";

       return (ns.getQuantitiesFromAccountsObject(
         accounts, system._id) * system.metrics.price.btc);
     }
     function usdCost(system) {
       return (r && r[system._id] && r[system._id].vUsd);
       if (!system.metrics || !system.metrics.price || !system.metrics.price.usd) return "no usd price found..";


       return (ns.getQuantitiesFromAccountsObject(
           accounts, system._id) * system.metrics.price.usd);
     }

     function equity(system) {
       var q = 0.0;
	   var { _id } = system
	   var supply = get(system, 'metrics.supply', 0)

       if (r[system._id]) q = r[_id] && r[_id].quantity || 0

       return supply ? 10000 * q / supply : 0.0
     }
     function share(system) {
       if (system._id && r[system._id]) {
         var vBtc = r[system._id].vBtc;

         var sum = _.reduce(_.map(r, function(it){
           return it.vBtc;
	   }), function(memo, num){ return memo + num; }, 0);

         return vBtc / sum;
       }
       return 0;
     }
     function usdPrice(system) {
       var prices = CF.CurrentData.getPricesByDoc(system);
       return prices && prices.usd || 0;
     }
     function usdPriceChange1d(system) {
       return get(system, 'metrics.priceChangePercents.day.usd', 0)
     }
     function usdCap(system) {
		    const	supply 	= get(system, 'metrics.supply', 0),
					usd 	= get(system, 'metrics.price.usd', 0)

			return supply * usd
     }

	//  TODO implement tooltips (or not?)
     function btcPriceChange1d(system) {
		return get(system, 'metrics.priceChangePercents.day.btc', 0)
     }

     function btcCap(system) {
		const	supply 	= get(system, 'metrics.supply', 0),
				btc 	= get(system, 'metrics.price.btc', 0)

		return btc * supply
     }

    return  <Grid>
				<Cell col={12}>
					<table className="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp center" {...props}>

						<thead>
							<tr>
								<th style={{textAlign: 'center'}} className="mdl-data-table__cell--non-numeric">
								    System
								</th>
								<th>Amount</th>
								<th>Equity</th>
								<th>Portfolio Share</th>
								<th>Value in BTC</th>
								<th>Value in USD</th>
								<th>USD Price<sup>1d Change</sup></th>
								<th>USD Cap</th>
							</tr>
						</thead>

						<tbody>
							{
								getSystems().map( system => {
									return  <tr key={system._id}>
												<td className="mdl-data-table__cell--non-numeric">
													<a href={`/system/${helpers._toUnderscores(system._id)}`}>
														<Image
															src={system}
															style={{marginRight: 24}}
															avatar
														/>
														<span>{helpers.displaySystemName(system)}</span>
													</a>
												</td>
												<td> {readableN2( quantity(system) )} </td>
												<td> {readableN3( equity(system) )}‱ </td>
												<td> {percents1( share(system) )} </td>
												<td> {readableN2( btcCost(system) )} </td>
												<td> {readableN0( usdCost(system) )} </td>
												<td>
												  {readableN2(usdPrice(system))}
												  <sup className={greenRedNumber(usdPriceChange1d(system))}>
													{readableN2(usdPriceChange1d(system))}%
												  </sup>
												</td>
												<td> {readableN0(usdCap(system))} </td>
											</tr>
								})
							}
						</tbody>

					</table>
				</Cell>
	        </Grid>
}

PortfolioTable.propTypes = {
	accounts: PropTypes.object.isRequired
}

export default PortfolioTable
