import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import { selector } from "../../api/userFunds/index"
import RatingTable from '../components/RatingTable'
import get from 'oget'

export default RatingTableContainer = createContainer(() => {

	const 	selector = 	{
							"flags.rating_do_not_display": { $ne: true },
							"calculatable.RATING.sum": { $gte: 1 },
							"metrics.tradeVolume": { $gte: 0.2 }
						}

	// trying to avoid "Cannot set property 'MarketData' of undefined"
	// FIXME delete this?
    CF.subs.MarketData = CF.subs.MarketData || Meteor.subscribe("marketDataRP", selector);

	const 	loaded 	= 	CF.SubsMan.subscribe("currentDataRP", selector).ready(),
			systems = 	CurrentData.find(
							 selector,
							// { sort }
						).fetch()

	console.warn(systems.length)

	return { loaded, systems }

}, RatingTable)
