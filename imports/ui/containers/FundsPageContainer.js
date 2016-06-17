import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import FundsPage from '../pages/FundsPage'

export default FundsPageContainer = createContainer(() => {
  const loaded = Meteor.subscribe('crowdsalesAndProjectsList').ready()
  const {selectors} = CF.CurrentData,
          crowdsales = CurrentData.find(selectors.crowdsales()).fetch(),
          projects =  CurrentData.find({
            $or: [{
              'crowdsales.start_date': {
                $gt: new Date()
              }
            }, {
              'crowdsales.start_date': {
                $exists: false
              }
            }],
            $and: [
            selectors.projects()]
          }, {
            sort: {
              "calculatable.RATING.vector.LV.sum": -1
            }
          }).fetch(),
          past = CurrentData.find({
            $and: [selectors.crowdsales(), {
              'crowdsales.end_date': {
                $lt: new Date()
              }
            }]
          }, {
            sort: {
              'crowdsales.end_date': -1
            }
          }).fetch(),
          upcoming = CurrentData.find({
            $and: [selectors.crowdsales(), {
              'crowdsales.start_date': {
                $gt: new Date()
              }
            }]
          }, {
            sort: {
              'crowdsales.start_date': 1
            }
          }).fetch(),
          active = CurrentData.find({
            $and: [selectors.crowdsales(), {
              'crowdsales.end_date': {
                $gt: new Date()
              }
            }, {
              'crowdsales.start_date': {
                $lt: new Date()
              }
            }]
          }, {sort: {"metrics.currently_raised": -1}}).fetch()
  return {crowdsales, projects, past, upcoming, active, loaded}
}, FundsPage)
