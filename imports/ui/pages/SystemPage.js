import React, { PropTypes } from 'react'
import { If, Unless } from '../components/Utils'
import Loading from '../components/Loading'
import Image from '../components/Image'
import Metrics from '../components/Metrics'
import ChaingearLink from '../components/ChaingearLink'
import SystemAbout from '../components/SystemAbout'
import CrowdsaleIsActive from '../components/CrowdsaleIsActive'
import StarredByContainer from '../containers/StarredByContainer'
import helpers from '../helpers'
import { Card, CardTitle, CardText, CardActions, Button, CardMenu, IconButton, Grid, Cell } from 'react-mdl'
import get from 'oget'

const RadarPage = props => {
const {loaded, system, system: {metrics, links}, mainLinks, isProject} = props

return loaded ? (
    <div id="SystemPage" className="text-center" itemScope itemType="http://schema.org/Product">
		<If condition={system.descriptions.page_state != 'ready'}>
		    <p>
				This page is not ready yet. Follow <a target="_blank" href={`https://github.com/cyberFund/chaingear/blob/gh-pages/sources/${system._id}/${system._id}.toml`}>fan zone</a> to help us improve it faster!
		    </p>
		</If>
		<SystemAbout system={system} />
		<StarredByContainer system={system} />
		<CrowdsaleIsActive system={system} />
		<Grid>
			{mainLinks.map(
				link => <Cell key={link.name} col={3} tablet={4} phone={4}>
							<ChaingearLink link={link} />
						</Cell>
			)}
		</Grid>
		<Unless condition={isProject}>
			<Grid>
				<Metrics
					title="Price"
					btc={get(metrics, 'price.btc')}
					usd={get(metrics, 'price.usd')}
					btcChange={get(metrics, 'priceChangePercents.day.btc')}
					usdChange={get(metrics, 'priceChangePercents.day.usd')}
				/>
				{/*<Metrics
					title="Cap"
					btc={}
					usd={}
					btcChange={}
					usdChange={}
				/>
				<Metrics
					title="Trade"
					btc={}
					usd={}
					btcChange={}
					usdChange={}
				/>
				<Metrics
					title="Supply"
					btc={}
					usd={}
					btcChange={}
					usdChange={}
				/>*/}
			</Grid>
		</Unless>
		<If condition={props.existLinksWith(links, 'Science')} component={Grid}>
			<Cell col={12} tablet={8} phone={4}>
		    	<h3>Scientific Roots</h3>
				{helpers.linksWithTag(links, 'Science').map(
					link => <p key={link.name}><ChaingearLink link={link} /></p>
				)}
			</Cell>
		</If>
		<If condition={props.existLinksWith(links, 'Code')} component={Grid}>
			<Cell col={12} tablet={8} phone={4}>
				<h3>Developers Dimension</h3>
				{helpers.linksWithTag(links, 'Code').map(
					link => <p key={link.name}><ChaingearLink link={link} /></p>
				)}
			</Cell>
		</If>
		<Grid>
			<p>{system.description}</p>
		</Grid>
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
	system: PropTypes.object.isRequired,
	mainLinks: PropTypes.array.isRequired
}

export default RadarPage
