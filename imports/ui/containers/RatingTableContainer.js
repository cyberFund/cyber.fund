import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import { selector } from "../../userFunds/index"
import RatingTable from '../components/RatingTable'
import get from 'oget'

export default RatingTableContainer = createContainer(() => {
  //const loaded = Meteor.subscribe("usersWithFunds").ready()

  return {
      loaded: true,
      systems: []
  }
}, RatingTable)
