import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import { selector } from "../../userFunds/index"
import RatingTable from '../components/RatingTable'
import get from 'oget'

export default RatingTableContainer = createContainer(() => {
	//
	// CF.subs.MarketData = 	CF.subs.MarketData
	// 						|| Meteor.subscribe("marketDataRP", {selector})

	const 	selector = 	{
							"flags.rating_do_not_display": { $ne: true },
							"calculatable.RATING.sum": { $gte: 1 },
							"metrics.tradeVolume": { $gte: 0.2 }
						}

			// trying to avoid "Cannot set property 'MarketData' of undefined"
		    // CF.subs = {}
		    CF.subs.MarketData = CF.subs.MarketData || Meteor.subscribe("marketDataRP", {
		      selector
		    });

		    // var handle = CF.SubsMan.subscribe("currentDataRP", {
		    //   selector: tableSelector()
		    // });
			const loaded = CF.SubsMan.subscribe("currentDataRP", { selector }).ready()

	return {
		loaded,
		systems: 	CurrentData.find(
						{ selector },
						// { sort }
					).fetch()
		}

}, RatingTable)
