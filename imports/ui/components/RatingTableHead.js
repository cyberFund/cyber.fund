import React from 'react'
import { Grid, Cell } from 'react-mdl'
import get from 'oget'
import { If, Show } from '../components/Utils'
import helpers from '../helpers'

const RatingTableHead = props => {

	//
	// return 	<th className="center hide-on-small-and-down">Rank</th>
	// 	    <th className="text-left">
	// 	    	<span className="th-sys">&nbsp;&nbsp;System</span>
	// 	    </th>
	//
    // {{#if eq _period "month"}}
    //   {{#thSortable class="center hide-on-small-and-down" o=__sorter
    //   s="metrics.supplyChangePercents.month"}}Token{{/ thSortable}}
    // {{else}}
    //   {{#thSortable class="center hide-on-small-and-down" o=__sorter
    //   s="metrics.supplyChangePercents.day"}}Token{{/ thSortable}}
    // {{/if}}
	//
    // {{#thSortable class="center hide-on-small-and-down" o=__sorter
    //   s="metrics.turnover"}}Trade{{/ thSortable}}
	//
	//
    // {{# thSortable o=__sorter class="center hide-on-med-and-down sorter"
    // s="calculatable.RATING.vector.GR.monthlyGrowthD"}}
    //   {{# withTooltip}} CMGR[$]
    //   {{#tooltip class="tooltip-table-head right0"}}
    //     <h5 class="center">Compound Monthly Growth Rate</h5>
    //     <p>
    //     Key indicator that shows long term profitability of investment.
    //     We use monthly calculation in opposite to annual in traditional
    //     finance as blockchain markets are faster than tradational thus
    //     should be evaulated more frequently</p>
    //   {{/ tooltip}} {{/ withTooltip}}
    // {{/ thSortable}}
	//
    // {{#thSortable o=__sorter class="center hide-on-med-and-down sorter"
    // s="calculatable.RATING.vector.GR.months"}}
    // {{# withTooltip}} Months
    // {{# tooltip class="tooltip-table-head right0"}}
	//
    //   <p>Number of periods CMGR has been calculated.
    //     Less a number of periods the more risk that CMGR will float</p>
    // {{/ tooltip}} {{/ withTooltip}} {{/ thSortable}}
	//
	//
    // {{! #thSortable class="right-align hide-on-med-and-down" o=__sorter
    // s="metrics.cap.btc"}}{{! Cap in Ƀ}}{{! / thSortable}}
	//
    // {{#if eq _period "month"}}
    //   {{! #thSortable class="right-align hide-on-med-and-down" o=__sorter
    //   s="metrics.capChangePercents.month.btc"}}{{! 1m&nbsp;Change}}{{! / thSortable}}
    // {{else}}
    //   {{! #thSortable class="right-align hide-on-med-and-down" o=__sorter
    //   s="metrics.capChangePercents.day.btc"}}{{! 1d&nbsp;Change}}{{! / thSortable}}
    // {{/if}}
	//
	//
    // {{#thSortable class="right-align" o=__sorter
    // s="metrics.cap.usd"}}Cap in ${{/ thSortable}}
	//
    // <th class="center hide-on-small-and-down">Price</th>
    // {{#if eq _period "month"}}
    //   {{#thSortable class="right-align" o=__sorter
    //   s="metrics.capChangePercents.month.usd"}}1m&nbsp;Change{{/ thSortable}}
    // {{else}}
    //   {{#thSortable class="right-align" o=__sorter
    //   s="metrics.capChangePercents.day.usd"}}1d&nbsp;Change{{/ thSortable}}
    // {{/if}}
	//
    // {{#thSortable class="center hide-on-small-and-down"
    // o=__sorter s="calculatable.RATING.vector.LV.num"}} Stars{{/ thSortable}}
	//
    // {{#thSortable class="center hide-on-small-and-down" o=__sorter
    // s="calculatable.RATING.sum"}}
    //   {{# withTooltip}} Rating
    //   {{# tooltip class="tooltip-table-head right0"}}
    //   <h5 class="center">Rating</h5>
    //   <p>
	// 	Compound evaluation of a given crypto property.
    //     Methodology depend on a stage, type and class of a given cryptoproperty.
    //     More than 50 indicators are evaluated in a realtime.
    //   </p>
	//   <p>
    //     <a target="_blank" href="https://github.com/cyberFund/cyberrating/blob/master/scoring.md">
    //       Full methodology</a> and rationale in paper <a target="_blank" href="https://github.com/cyberFund/cyberrating/blob/master/paper.md">
    //       cyber•Rating: Cryptoproperty Evaluation</a>
    //   </p>
    //   {{/ tooltip }} {{/withTooltip}}
    // {{/ thSortable}}

    return 	<Grid>
				<Cell col={12}>
		  			<a href="/monthly/rating"> Switch to monthly view </a>
				</Cell>
				<If condition={props.subReady}>
					<Cell col={12} className="table-overflow" {...props}>
						{/* FIXME do we need id and styles? */}
						<table
							id="rating-table"
							style={{width: '100%'}}
							className="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp center"
						>
							<thead>
								<tr>
									<th>Rank</th>
									<th className="mdl-data-table__cell--non-numeric">System</th>
									<th>Token</th>
									<th>Trade</th>
									<th>CMGR[$]</th>
									<th>Months</th>
									<th>Cap in $</th>
									<th>Price</th>
									<th>1d Change</th>
									<th>Stars</th>
									<th>Rating</th>
								</tr>
							</thead>
							<tbody>
								{/*renderRows*/}
							</tbody>
			            </table>

						{/* FIXME refactor this? */}
						<If condition={props.hasMore}>
						    <p className="center">
						        We filter illiquid assets and assets with <a href="https://www.academia.edu/22691395/cyber_Rating_Crypto_Property_Evaluation" target="_blank">cyber • Rating</a> less than 1
						    </p>
						    <div className="center">
						        <br />
						        <a className="waves-effect waves-light btn show-more deep-orange" href="/tracking">
						      View all opportunities
						    </a>
						    </div>
						</If>
					</Cell>
				</If>
			</Grid>

}

export default RatingTableHead
