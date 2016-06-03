import React, { Component, PropTypes } from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import RadarPage from '../pages/RadarPage'


class RadarPageContainer extends Component {
  render() return <RadarPage />
}

RadarPageContainer.propTypes = {
 crowdsales: PropTypes.array.isRequired,
 projects: PropTypes.array.isRequired,
 past: PropTypes.array.isRequired,
 upcoming: PropTypes.array.isRequired,
 active: PropTypes.array.isRequired
}

export default createContainer(() => {
  Meteor.subscribe('crowdsalesAndProjectsList')
  const cfCDs = CF.CurrentData.selectors,
  crowdsales = CurrentData.find(cfCDs.crowdsales()).fetch(),
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
    cfCDs.projects()]
  }, {
    sort: {
      "calculatable.RATING.vector.LV.sum": -1
    }
  }).fetch(),
  past = CurrentData.find({
    $and: [cfCDs.crowdsales(), {
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
    $and: [cfCDs.crowdsales(), {
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
    $and: [cfCDs.crowdsales(), {
      'crowdsales.end_date': {
        $gt: new Date()
      }
    }, {
      'crowdsales.start_date': {
        $lt: new Date()
      }
    }]
  }, {sort: {"metrics.currently_raised": -1}}).fetch()
  console.log(crowdsales, projects, past, upcoming, active)
  return {crowdsales, projects, past, upcoming, active}
}, RadarPageContainer)
