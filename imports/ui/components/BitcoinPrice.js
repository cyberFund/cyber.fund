import React, { PropTypes } from 'react'
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'
import { Spinner } from 'react-mdl'
import helpers from '../helpers'

const BitcoinPrice = props => {
	return props.bitcoinPrice ? <span>${props.bitcoinPrice} per Ƀ</span> : <Spinner />
}

BitcoinPrice.propTypes = {
	bitcoinPrice: PropTypes.number.isRequired
}

export default createContainer( props => {
	Meteor.subscribe("currentDataRP", 'Bitcoin')

	const 	dataIsReady = helpers._btcPrice(),
			bitcoinPrice = dataIsReady ? helpers.readableNumbers(dataIsReady) : 0

	return { bitcoinPrice }

}, BitcoinPrice)
