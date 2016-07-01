import React, { PropTypes } from 'react'
import { If, Unless } from '../components/Utils'
import Loading from '../components/Loading'
import Image from '../components/Image'
import Metrics from '../components/Metrics'
import ChaingearLink from '../components/ChaingearLink'
import SystemAbout from '../components/SystemAbout'
import CrowdsaleIsActive from '../components/CrowdsaleIsActive'
import StarredByContainer from '../containers/StarredByContainer'
import KeenChart from '../components/KeenChart'
import helpers from '../helpers'
import { Card, CardTitle, CardText, CardActions, Button, CardMenu, IconButton, Grid, Cell } from 'react-mdl'
import get from 'oget'

const RadarPage = props => {
// variables
const {system, system: {metrics, links, _id}} = props
const {loaded, mainLinks, isProject, existLinksWith, dependentsExist, dependents} = props
const githubLink =  `https://github.com/cyberFund/chaingear/blob/gh-pages/sources/${_id}/${_id}.toml`

return loaded ? (
    <section id="SystemPage" className="text-center" itemScope itemType="http://schema.org/Product">
		<If condition={system.descriptions.page_state != 'ready'}>
		    <p>
				This page is not ready yet. Follow <a target="_blank" href={githubLink}>fan zone</a> to help us improve it faster!
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
		<Unless condition={isProject} component={Grid}>
			<Metrics
				title="Price"
				btc={get(metrics, 'price.btc')}
				usd={get(metrics, 'price.usd')}
				btcChange={get(metrics, 'priceChangePercents.day.btc')}
				usdChange={get(metrics, 'priceChangePercents.day.usd')}
			/>
			<Metrics
				title="Cap"
				btc={get(metrics, 'price.btc')}
				usd={get(metrics, 'price.usd')}
				btcChange={get(metrics, 'priceChangePercents.day.btc')}
				usdChange={get(metrics, 'priceChangePercents.day.usd')}
			/>
			<Metrics
				title="Trade"
				btc={get(metrics, 'price.btc')}
				usd={get(metrics, 'price.usd')}
				btcChange={get(metrics, 'priceChangePercents.day.btc')}
				usdChange={get(metrics, 'priceChangePercents.day.usd')}
			/>
			<Metrics
				title="Supply"
				btc={get(metrics, 'price.btc')}
				usd={get(metrics, 'price.usd')}
				btcChange={get(metrics, 'priceChangePercents.day.btc')}
				usdChange={get(metrics, 'priceChangePercents.day.usd')}
			/>
		</Unless>
		<If condition={existLinksWith(links, 'News')} component={Grid}>
			<Cell col={12} tablet={8} phone={4}>
			    <h3>News</h3>
			    <div>
					{helpers.linksWithTag(links, 'News').map(
						link => <p key={link.name}><ChaingearLink link={link} /></p>
					)}
			    </div>
			</Cell>
		</If>
		<If condition={dependentsExist} component={Grid}>
			<Cell col={12} tablet={8} phone={4}>
				<h3>Internal Economy</h3>
				<div>
					{dependents.map((item, index) => <p key={index}>{item._id}</p>)}
				</div>
			</Cell>
		</If>
		<If condition={existLinksWith(links, 'Science')} component={Grid}>
			<Cell col={12} tablet={8} phone={4}>
		    	<h3>Scientific Roots</h3>
				{helpers.linksWithTag(links, 'Science').map(
					link => <p key={link.name}><ChaingearLink link={link} /></p>
				)}
			</Cell>
		</If>
		<If condition={existLinksWith(links, 'Code')} component={Grid}>
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
			<Cell col={12}>
				<p>You can <a target="_blank" href={githubLink}> improve {_id}'s page</a> on Github.</p>
			</Cell>
		</Grid>
		<Grid>
			<Cell col={12}>
		 		<KeenChart id="meow" value={_id} />
			</Cell>
		</Grid>
		<Grid>
			<Cell col={12}>
				Floating button
			</Cell>
		</Grid>
    </section>
) : <Loading />
}

RadarPage.propTypes = {
	system: PropTypes.object.isRequired,
	mainLinks: PropTypes.array.isRequired,
	dependentsExist: PropTypes.number.isRequired,
	dependents: PropTypes.array.isRequired,
	existLinksWith: PropTypes.func.isRequired
}

export default RadarPage
