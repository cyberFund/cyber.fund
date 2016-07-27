import React, { PropTypes } from 'react'
import { Card } from 'react-mdl'
import Image from '../components/Image'
import helpers from '../helpers'

const SystemLink = props => {
	const 	{ system } = props,
			innerStyle = {
	                display: 'inline-flex',
	                flexDirection: 'row',
	                alignItems: 'center',
	                verticalAlign: 'middle',
	                minHeight: '60px',
	                maxHeight: '100px',
	                width: 'auto'
			},
			imgStyle = {
					width: 'auto',
					height: '45px',
					marginLeft: 'auto'
			},
			textStyle = {
					verticalAlign: 'middle',
					marginLeft: '1em',
					marginRight: 'auto',
					textAlign: 'center'
			},
			linkStyle = {color: 'inherit', textDecoration: 'none'}

	return 	<a href={`/system/${helpers._toUnderscores(system._id)}`} style={linkStyle}>
				<Card className="hover-shadow" shadow={2} style={{minHeight: 'inherit', width: 'auto'}}>
					<div style={innerStyle}>
						<img
							style={imgStyle}
							src={CF.Chaingear.helpers.cgSystemLogoUrl(system)} alt={system._id + 'logo'}
						/>
						<span style={textStyle} className="text-large">{system._id}</span>
					</div>
				</Card>
			</a>
}

SystemLink.propTypes = {
    system: PropTypes.object.isRequired,
	card: PropTypes.bool // TODO add exaplanation
}

export default SystemLink
