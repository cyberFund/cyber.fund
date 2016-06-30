import React, { PropTypes } from 'react'
import { Grid, Cell } from 'react-mdl'
import { If } from '../components/Utils'
import Image from '../components/Image'
import Rating from '../components/Rating'
import helpers from '../helpers'
import get from 'oget'

const SystemAbout = props => {
	const {system} = props

	return 	<Grid className="text-center">
				<Cell col={4} tablet={2} phone={1} style={{height: '8em'}}>
					<Image src={system} itemProp='logo' />
				</Cell>
				<Cell col={4} tablet={4} phone={2}>
					<h1 itemProp="name">
						{helpers.displaySystemName(system)}
					</h1>
					<h2 itemProp="alternateName">{system.symbol}</h2>
				</Cell>
				<Cell col={4} tablet={2} phone={1}>
		            <div itemProp="aggregateRating" content={get(system, 'ratings.rating_cyber')}>
						<Rating value={system.calculatable.RATING.sum} />
		            </div>
					<span style={{fontSize: 12}}>
						{system.descriptions.state}
						{system.descriptions.system_type}
						<br />
						{system.consensus.type}
						{system.consensus.algorithm}
					</span>
				</Cell>
				<Cell col={12} tablet={8} phone={4}>
					<If condition={get(system, 'descriptions.headline')}>
						<p itemProp="description">{system.descriptions.headline}</p>
				    </If>
				</Cell>
	        </Grid>
}

SystemAbout.propTypes = {
  system: PropTypes.object.isRequired
}

export default SystemAbout
