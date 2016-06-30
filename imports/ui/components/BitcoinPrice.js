import React from 'react'
import { Spinner } from 'react-mdl'
import helpers from '../helpers'

const BitcoinPrice = props => {

	const dataIsReady = helpers._btcPrice()
	const bitcoinPrice = dataIsReady ? helpers.readableNumbers(dataIsReady) : null

	return dataIsReady ? <span> ${bitcoinPrice} per Ƀ </span> : <Spinner />
}

export default BitcoinPrice
