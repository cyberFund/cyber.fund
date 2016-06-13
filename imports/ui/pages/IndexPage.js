import React, { Component, PropTypes } from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import helpers from '../helpers'
import { If, Then, Else } from 'react-if'
import { Button,  Grid, Cell } from 'react-mdl'
import Top5Assets from '../components/Top5Assets'
import CybernomicsCap from '../components/CybernomicsCap'
import BalanceChecker from '../components/BalanceChecker'
import CrowdsaleCardList from '../components/CrowdsaleCardList'

class IndexPage extends Component {
  render() {
    return (
      <div id="IndexPage" className="text-center">
        {/* HEADERS */}
        <Grid>
          <Cell col={12}>
            <h2>Blockchains Grow Here</h2>
            <h5>{this.props.usersCount} people are ready to invest in {this.props.coinsCount} groundbreaking systems</h5>
          </Cell>
        </Grid>
        {/* ASSETS TABLE */}
        <Top5Assets systems={this.props.systems}>{/* component */}
          <Cell col={12} className="text-center">{/* components children */}
            <Button component="a" href="/rating" style={{margin: '0 5px'}} raised colored>Start Investing</Button>
            <Button component="a" href="/listing" style={{margin: '0 5px'}} raised disabled>Attract Investments</Button>
          </Cell>
        </Top5Assets>
        {/* WIDGETS */}
        <Grid>
            <Cell col={4} tablet={4} phone={4}>
                <h5>Daily Widget</h5>
                <CybernomicsCap col={12}
                capUsd={this.props.capUsd}
                capBtc={this.props.capBtc}
                capBtcDailyChange={this.props.capBtcDailyChange}
                capUsdDailyChange={this.props.capUsdDailyChange}
                />
                <BalanceChecker col={12} />
                <Button component='a' href="/funds" primary ripple>Funds</Button>
            </Cell>
            <CrowdsaleCardList
                col={4} tablet={4} phone={4}
                title="Active Crowdsales"
                size="small"
                items={this.props.activeCrowdsales} />
            <Cell col={4} tablet={4} phone={4}>
                <h5>My Portfolio</h5>
                <h4>
                    ~{Meteor.userId() ? helpers.readableN2(this.props.sumBtc) : 0} bitcoins
                </h4>
                <If condition={Boolean(!Meteor.userId())}>
                    <Then>
                        <Button component='a' href="/welcome" primary ripple>Join Us</Button>
                    </Then>
                </If>
            </Cell>
        </Grid>

      </div>
    )
  }
}

IndexPage.propTypes = {
  sumBtc: PropTypes.number.isRequired,
  usersCount: PropTypes.number.isRequired,
  coinsCount: PropTypes.number.isRequired,
  systems: PropTypes.array.isRequired,
  activeCrowdsales: PropTypes.array.isRequired
}

export default createContainer(() => {
  Meteor.subscribe("investData")
  Meteor.subscribe("currentDataRP", {selector: {
  }, sort:{"calculatable.RATING.sum": -1}, limit: 5} )
  Meteor.subscribe("crowdsalesAndProjectsList")

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
    systems: CurrentData.find({}, {sort:{"calculatable.RATING.sum": -1}, limit: 5}).fetch()
  }
}, IndexPage)
