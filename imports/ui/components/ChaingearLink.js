import React, { PropTypes } from 'react'
import Image from '../components/Image'
import helpers from '../helpers'

const ChaingearLink = props => {
	const { link } = props

	let content
	 // if card prop is specified render card with image
	if (props.card)	content = 	<span className="text-large text-center cglinkcard-text">
									<Image src={"https://static.cyber.fund/logos/" + link.icon} small />
									&nbsp;{link.name}
								</span>
	// else render inline link
	else 			content = 	<span>
									<i className={`fa fa-${ helpers.iconUrl(link) || 'fa-external-link-square' }`}></i>
									&nbsp;{link.name}
								</span>
								
	return 	<a
				href={link.url}
				target="_blank"
				style={{textDecoration: 'none'}}
				{...props}
			>
				{content}
			</a>
}

ChaingearLink.propTypes = {
    link: PropTypes.object.isRequired,
	card: PropTypes.bool
}

export default ChaingearLink
