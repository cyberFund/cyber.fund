import React from 'react'
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'
import IndexPage from '../pages/IndexPage'

export default IndexPageContainer = createContainer(() => {
    const 	investDataReady  = 	Meteor.subscribe("investData").ready(),
			crowdsalesReady  = 	Meteor.subscribe("crowdsalesAndProjectsList").ready(),
			currentDataReady = 	Meteor.subscribe("currentDataRP", {
										selector: {},
										sort:{"calculatable.RATING.sum": -1},
										limit: 5
								}).ready()

    // variables
    // TODO: ??? do we even use any of this?
    const cap = Extras.findOne("total_cap"),
    capBtc = cap ? cap.btc : 0,
    capUsd = cap ? cap.usd : 0,
    capUsdYesterday = cap ? cap.usdDayAgo : 0,
    capBtcDailyChange = cap && cap.btc ? (cap.btc - cap.btcDayAgo)/cap.btc * 100 : 0,
    capUsdDailyChange = cap && cap.usd ? (cap.usd - cap.usdDayAgo)/cap.usd * 100 : 0,
    sumBtc = () => {
      let ret = 0
      if (!Meteor.userId()) return ret
      CF.Accounts.collection
          .find({refId: Meteor.userId()}).fetch()
          .forEach(acc =>{
            ret += acc.vBtc || 0;
          })
      return ret;
    }
    // TODO: move active corwsales into CrowdsaleCardListContainer with type=active
    const activeCrowdsales = CurrentData.find({
      $and: [{crowdsales: {$exists: true}}, {
        "crowdsales.end_date": {
          $gt: new Date()
        }
      }, {
        "crowdsales.start_date": {
          $lt: new Date()
        }
      }]
    }, {sort: {"metrics.currently_raised": -1}}).fetch();

    /* TODO: seems like we need only sumBtc variable
    can we make getSumBtc() which does try {return cap.btc*cap.usd bla bla... OR return 0}
    this will make code more readable */

    return {
      capUsd,
      capBtc,
      capUsdDailyChange,
      capBtcDailyChange,
      activeCrowdsales,
      sumBtc: sumBtc(),
      usersCount: Counts.get('usersCount'),
      coinsCount: Counts.get('coinsCount'),
      systems: CurrentData.find({}, {
					  sort:{"calculatable.RATING.sum": -1},
					  limit: 5
				  }).fetch(),
      loaded: investDataReady && crowdsalesReady && currentDataReady
    }
}, IndexPage)
