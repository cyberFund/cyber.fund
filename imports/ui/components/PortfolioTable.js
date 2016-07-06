import React, { PropTypes } from 'react'
import {Grid, Cell} from 'react-mdl'
import helpers from '../helpers'
import Image from '../components/Image'

/*Template["portfolioWidgetTable"].events({
  "click th.sorter": function (e, t) {
    var newSorter = $(e.currentTarget).data("sorter");
    var sort = CF.Utils._session.get("folioWidgetSort");
    // same sorting criteria - reverse order
    if (sort[newSorter]) {
      sort[newSorter] = -sort[newSorter];
    } else {
      sort = {};
      sort[newSorter] = -1;
    }
    analytics.track("Sorted Portfolio", {
      sort: sort
    });
    CF.Utils._session.set("folioWidgetSort", sort);
  }
});*/

const PortfolioTable = props => {
	// render rows with data
  	function renderRows() {
		return props.systems.map( system => {
			return  <tr key={system._id}>
						<td className="mdl-data-table__cell--non-numeric">
							<a href={`/system/${helpers._toUnderscores(system._id)}`}>
								<Image
									avatar
									src={CF.Chaingear.helpers.cgSystemLogoUrl(system)}
									style={{marginRight: 24}}
									/>
								<span>{helpers.displaySystemName(system)}</span>
							</a>
						</td>
						<td>
							{helpers.readableN2(system.quantity)}
						</td>
						<td>
							{helpers.readableN3(system.equity)}
						</td>
						<td>
							{helpers.percents1(system.share)}
						</td>
						<td>
							{helpers.readableN2(system.btcCost)}
						</td>
						<td>
							{helpers.readableN0(system.usdCost)}
						</td>
					</tr>
		})
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
								<th>USD Price<sup>1d Change</sup></th>
							</tr>
						</thead>
						<tbody>
							{renderRows()}
						</tbody>
					</table>
				</Cell>
	          {/* you can add components after table */}
	          {props.children}
	        </Grid>
}
// TODO do not forget to add props
PortfolioTable.propTypes = {
    //component: 'span'
}
export default PortfolioTable
