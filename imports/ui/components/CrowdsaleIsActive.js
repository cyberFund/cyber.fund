import React, { PropTypes } from 'react'
import { Grid, Cell } from 'react-mdl'
import { If } from '../components/Utils'
import helpers from '../helpers'

const CrowdsaleIsActive = props => {
	// if crowdsale not active return nothing
	if (! helpers.cgIsActiveCrowdsale(props.system) ) return null

	// variables
	const { system, system: { crowdsales, metrics } } = props,
			lastUpdated = helpers.dateFormat(metrics.currently_raised_updatedAt, "llll"),
			endsAt = helpers.dateFormat(crowdsales.end_date, "llll")

	// get key-value list of crowdsales
	function raisedSales() {
		for(key in metrics.currently_raised_full) {
			return <p>{key}: {metrics.currently_raised_full[key]}</p>
		}
	}

	return  <Grid>
				<Cell col={12} tablet={8} phone={4}>
					<section className="card light-green lighten-4" >
						<div className="card-content">
							<h5> This project is currently in crowdsale phase</h5>
							<a href={crowdsales.funding_terms}
							   target="_blank" style={{margin: '0 4em'}}>
							   Funding terms
							</a>
							<a href={crowdsales.funding_url}
							   target="_blank" style={{margin: '0 4em'}}>
							   Invest
							</a>
						</div>
						<If condition={metrics.currently_raised_full}>
							<div className="card-content light-green lighten-5">
							    <h6>Currently raised: </h6>
								<sub> <i>last updated at: {lastUpdated}</i> </sub>
								{raisedSales()}
							    <h6>Crowdsale ends at: {endsAt}</h6>
							</div>
						</If>
					</section>
				</Cell>
			</Grid>
}

CrowdsaleIsActive.propTypes = {
  system: PropTypes.object.isRequired
}

export default CrowdsaleIsActive
