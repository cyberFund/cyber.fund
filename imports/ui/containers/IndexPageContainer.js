import React from 'react'
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'
import IndexPage from '../pages/IndexPage'
import get from 'oget'

export default IndexPageContainer = createContainer(() => {
    const 	investDataReady  = 	Meteor.subscribe("investData").ready(),
			crowdsalesReady  = 	Meteor.subscribe("crowdsalesAndProjectsList").ready()

    // variables
    // TODO: ??? do we even use any of this?
    const 	cap = Extras.findOne("total_cap"),
		    capBtc = get(cap, 'btc', 0),
		    capUsd = get(cap, 'usd', 0),
			btcDayAgo = get(cap, 'btcDayAgo', 0),
			usdDayAgo = get(cap, 'usdDayAgo', 0),
		    //capUsdYesterday = get(cap, 'usdDayAgo', 0),
		    capBtcDailyChange = (capBtc - btcDayAgo)/capBtc * 100,
		    capUsdDailyChange = (capUsd - usdDayAgo)/capUsd * 100

    function sumBtc() {
		let ret = 0
		if (!Meteor.userId()) return ret
		CF.Accounts.collection
			.find({refId: Meteor.userId()}).fetch()
			.forEach(acc =>{ ret += acc.vBtc || 0 })
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
      loaded: investDataReady && crowdsalesReady
    }
}, IndexPage)
