import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import Top5Assets from '../components/Top5Assets'

export default createContainer( props => {

	// NOTE this is a copy paste from ratings table component
	// reason this is used: other subscriptions somehow didn't give proper data
	// problem and how ot solve it is currently unknown
	const 	selector = 	{
							"flags.rating_do_not_display": { $ne: true },
							"calculatable.RATING.sum": { $gte: 1 },
							"metrics.tradeVolume": { $gte: 0.2 }
						}

	CF.subs.MarketData = CF.subs.MarketData || Meteor.subscribe("marketDataRP", {selector})

	CF.SubsMan.subscribe("currentDataRP", { selector })

	const	systems = 	CurrentData.find({}, {
							sort: { "calculatable.RATING.sum": -1 },
							limit: 5
						}).fetch()

	return 	{ systems }

}, Top5Assets)
