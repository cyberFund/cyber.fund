import React, { PropTypes } from 'react'
import { Card } from 'react-mdl'
import Image from './Image'
import { If } from './Utils'
import helpers from '../helpers'

const CardLink = props => {

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

	return 	<a href={props.href} style={linkStyle}>
				<Card className="hover-shadow" shadow={2} style={{minHeight: 'inherit', width: 'auto'}}>
					<span style={innerStyle} className="text-large">
						<If condition={props.src}>
							<img
								style={imgStyle}
								src={props.src}
								alt={props.alt}
								/>
						</If>
						<span style={textStyle}> {props.text} </span>
					</span>
				</Card>
			</a>
}

CardLink.propTypes = {
	text: PropTypes.string.isRequired,
	href: PropTypes.string.isRequired,
	// image props are optional
    src: PropTypes.string,
	alt: PropTypes.string
}

export default CardLink
