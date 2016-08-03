import React, { PropTypes } from 'react'
import { Card } from 'react-mdl'
import Image from '../components/Image'
import helpers from '../helpers'

// usage example:
// <SystemLink
// 	 system={Object}
// 	 card // optional
// />

const SystemLink = props => {

	// data
	const 	{ system } = props
	// styles
	const	innerStyle = {
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

	// render link as card or inline
	if (props.card)	return 	<a href={`/system/${helpers._toUnderscores(system._id)}`} style={linkStyle}>
								<Card className="hover-shadow" shadow={2} style={{minHeight: 'inherit', width: 'auto'}}>
									<div style={innerStyle}>
										<img
											style={imgStyle}
											src={CF.Chaingear.helpers.cgSystemLogoUrl(system)}
											alt={system._id + 'logo'}
										/>
										<span style={textStyle} className="text-large">{system._id}</span>
									</div>
								</Card>
							</a>

	else 			return	<a href={`/system/${helpers._toUnderscores(system._id)}`}>
								<Image
									src={system}
									style={{marginRight: 24}}
									avatar
								/>
								<span>{helpers.displaySystemName(system)}</span>
							</a>
}

SystemLink.propTypes = {
	card: PropTypes.bool,
    system: PropTypes.object.isRequired
}

export default SystemLink
