import React, { PropTypes } from 'react'
import helpers from '../helpers'

const Rating = props => {

	function renderStars() {
		let stars = []
		for (var i=0; i<Math.round(props.value); i++) stars.push(1)
		return stars = stars.map(i => '✪ ')
	}

    return  <span
				data-value={helpers.cfRatingRound(props.value)}
				title={helpers.cfRatingRound(props.value)}
				className="rating"
				{...props}
				>
				{renderStars()}
			</span>
}

Rating.propTypes = {
    value: PropTypes.number.isRequired
}

export default Rating
