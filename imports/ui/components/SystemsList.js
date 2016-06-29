import React, { PropTypes } from 'react'
import helpers from '../helpers'
import Image from '../components/Image'

const SystemsList = props => {
	const systems = props.systems.map( system => {
		return  <a
					key={system._id}
					href={`/system/${helpers._toUnderscores(system._id)}`}
					title={system._id}>
					<Image src={system} avatar />
				</a>
	})
    return <div {...props}>{systems}</div>
}

SystemsList.defaultProps = {
	systems: []
}

SystemsList.propTypes = {
 systems: PropTypes.array.isRequired
}

export default SystemsList
