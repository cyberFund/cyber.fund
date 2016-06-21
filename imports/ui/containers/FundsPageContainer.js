import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import { selector } from "../../userFunds/index"
import FundsPage from '../pages/FundsPage'
import get from 'oget'

export default FundsPageContainer = createContainer(() => {
  const loaded = Meteor.subscribe("usersWithFunds").ready()
  const user = Meteor.user()

  let iFollow = get(user, 'user.profile.followingUsers', [])
  if (user) iFollow.push(user._id)

  function fundsIfollow (){
    if (iFollow) {
      return Meteor.users.find({_id: {$in: iFollow}}, {
            sort: {publicFunds: -1}
            }).fetch()
    }
    else return []
  }
  function fundsIdontFollow (){
    if (iFollow) selector._id = {$nin: iFollow}
    return Meteor.users.find(selector, {
          limit: Session.get("showAllUsersAtFunds") ? 1000 : 50,
          sort: {publicFunds: -1}
        }).fetch()
  }

  return {
      loaded,
      fundsIfollow: fundsIfollow(),
      fundsIdontFollow: fundsIdontFollow()
  }
}, FundsPage)
