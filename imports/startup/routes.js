import React from 'react'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { mount } from 'react-mounter'

import MainLayout from '../ui/pages/MainLayout'
import IndexPage from '../ui/pages/IndexPage'
import WelcomePage from '../ui/pages/WelcomePage'
import RadarPage from '../ui/pages/RadarPage'
import RatingPage from '../ui/pages/RatingPage'
import FundsPage from '../ui/pages/FundsPage'

const routes = [
  ['/', <IndexPage />],
  ['/welcome', <WelcomePage />],
  ['/radar', <RadarPage />],
  ['/rating', <RatingPage />],
  ['/funds', <FundsPage />]
].forEach( item =>{
    FlowRouter.route(item[0], {
      action() {
        mount(MainLayout, {
          main: item[1]
        })
      }
    })
  })

FlowRouter.notFound = {
    action: function() {
      console.warn('Route not found! Redirecting to index page')
      mount(MainLayout, {
        // TODO: create 404Page component
          main: <IndexPage />
      })
    }
}
