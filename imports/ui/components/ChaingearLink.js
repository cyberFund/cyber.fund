import React, { PropTypes } from 'react'
import { Cell } from 'react-mdl'
import CardLink from './CardLink'
import helpers from '../helpers'

// usage example:
// <ChaingearLink link={props.link} card />
// "card" is optional

const ChaingearLink = props => {
	const { link, link: { name, url, icon } } = props

	 // if card prop is specified render card with image
	if (props.card)	return 	<Cell
								col={3} tablet={4} phone={4}
								style={{ display: 'inline-block'}}
								key={name}
								{...props}
							>
								<CardLink
									text={name}
									href={url}
									src={"https://static.cyber.fund/logos/" + icon}
									alt={name + "'s logo"}
								/>
							</Cell>

	// else return link with icon
	return 	<a
				href={url}
				target="_blank"
				style={{textDecoration: 'none'}}
				{...props}
			>
				<span>
					<i className={`fa fa-${ helpers.iconUrl(link) || 'fa-external-link-square' }`}></i>
					&nbsp;{name}
				</span>
			</a>
}

ChaingearLink.propTypes = {
    link: PropTypes.object.isRequired,
	card: PropTypes.bool
}

export default ChaingearLink
