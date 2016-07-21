import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import Top5Assets from '../components/Top5Assets'

export default createContainer( props => {

	const 	selector = 	{
							selector: {},
							sort: { "calculatable.RATING.sum": -1 } //,
							// limit: 5
						},
			loaded 	= 	Meteor.subscribe("currentDataRP", selector).ready(),
			systems = 	CurrentData.find({}, {
							sort: { "calculatable.RATING.sum": -1 },
							limit: 5
						}).fetch()

	return { loaded, systems }

}, Top5Assets)
