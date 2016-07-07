import React, { PropTypes } from 'react'
import helpers from '../helpers'
import { Show } from '../components/Utils'
import Image from '../components/Image'

const SystemsList = props => {
	return 	<Show condition={props.systems} component='section' {...props}>
				<h5>{props.title}</h5>
				{
					props.systems.map( system => {
					return  <a
								key={system._id}
								href={`/system/${helpers._toUnderscores(system._id)}`}
								title={system._id}
							>
								<Image src={system} avatar />
							</a>
					})
				}
				{props.children}
			</Show>
}

SystemsList.propTypes = {
	systems: PropTypes.array.isRequired,
	title: PropTypes.string
}

export default SystemsList
