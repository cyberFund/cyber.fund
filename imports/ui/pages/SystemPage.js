import React, { PropTypes } from 'react'
import { If } from '../components/Utils'
import Loading from '../components/Loading'
import Image from '../components/Image'
import SystemAbout from '../components/SystemAbout'
import StarredByContainer from '../containers/StarredByContainer'
import helpers from '../helpers'
import { Card, CardTitle, CardText, CardActions, Button, CardMenu, IconButton, Grid, Cell } from 'react-mdl'

const RadarPage = props => {

const {loaded, system} = props
return loaded ? (
    <div id="SystemPage" className="text-center" itemScope itemType="http://schema.org/Product">
		<If condition={system.descriptions.page_state != 'ready'}>
		    <p>
				This page is not ready yet. Follow <a target="_blank" href={`https://github.com/cyberFund/chaingear/blob/gh-pages/sources/${system._id}/${system._id}.toml`}>fan zone</a> to help us improve it faster!
		    </p>
		</If>
		<SystemAbout system={system} />
		<StarredByContainer system={system} />
		<If condition={helpers.cgIsActiveCrowdsale(system)} component={Grid}>
			<Cell col={12} tablet={8} phone={4}>
				<section className="card light-green lighten-4" >
					<div className="card-content">
						<h5> This project is currently in crowdsale phase</h5>
						<a href={system.crowdsales.funding_terms}
						   target="_blank" style={{margin: '0 4em'}}>
						   Funding terms
						</a>
						<a href={system.crowdsales.funding_url}
						   target="_blank" style={{margin: '0 4em'}}>
						   Invest
						</a>
					</div>
					<If condition={system.metrics.currently_raised_full}>
						<div className="card-content light-green lighten-5">
						  <h6>Currently raised: </h6>
							<sub><i>last updated at: {helpers.dateFormat(system.metrics.currently_raised_updatedAt, "llll")}</i></sub>
							{/*#each keyValue metrics.currently_raised_full}}
								<p>{{key}}: {{value}}</p>
							{{/each} */}
						  <h6>Crowdsale ends at: {helpers.dateFormat(system.crowdsales.end_date, "llll")}</h6>
						</div>
					</If>
				</section>
			</Cell>
		</If>
        <Grid>
			system.infoLinks
		</Grid>
		<Grid>
			system.stats:
			price cap trade supply
		</Grid>
		<Grid>
			info graph
		</Grid>
		<Grid>
			News:
			CardLinks
		</Grid>
		<Grid>
			Apps:
			tabs*4> LinkCards
		</Grid>
		<Grid>
			Internal Economy:
			LinkCards
		</Grid>
		<Grid>
			Scientific Roots:
			links list
		</Grid>
		<Grid>
			Developers Dimension:
			links list
		</Grid>
		<Grid>
			Specification:
			table
		</Grid>
		<Grid>
			page visits graph
		</Grid>
    </div>
) : <Loading />
}

RadarPage.propTypes = {
	system: PropTypes.object.isRequired
}

export default RadarPage
