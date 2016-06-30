import React, { PropTypes } from 'react'
import { If } from '../components/Utils'
import Loading from '../components/Loading'
import Image from '../components/Image'
import SystemAbout from '../components/SystemAbout'
import CrowdsaleIsActive from '../components/CrowdsaleIsActive'
import StarredByContainer from '../containers/StarredByContainer'
import helpers from '../helpers'
import { Card, CardTitle, CardText, CardActions, Button, CardMenu, IconButton, Grid, Cell } from 'react-mdl'

const RadarPage = props => {

const {loaded, system} = props
const mainLinks = 	<Cell col={12} tablet={8} phone={4}>
						{props.mainLinks.map(
							link => <a key={link.name} href={link.url}>{link.name}</a>
						)}
					</Cell>
console.log(system)
props.mainLinks.map((item) => {console.log(item)})
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
        <Grid>{mainLinks}</Grid>
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
