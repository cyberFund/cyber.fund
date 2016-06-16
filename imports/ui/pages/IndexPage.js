import React, { Component, PropTypes } from 'react'
import { Meteor } from 'meteor/meteor'
import helpers from '../helpers'
import { If, Then, Else } from 'react-if'
import { Button,  Grid, Cell } from 'react-mdl'
import Top5Assets from '../components/Top5Assets'
import CybernomicsCap from '../components/CybernomicsCap'
//import BalanceChecker from '../components/BalanceChecker'
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
        <Grid> {/* TODO: move Cell into <DayliWidget /> ? */}
            <Cell col={4} tablet={4} phone={4}>
                <h5>Daily Widget</h5>
                <CybernomicsCap col={12}
                capUsd={this.props.capUsd}
                capBtc={this.props.capBtc}
                capBtcDailyChange={this.props.capBtcDailyChange}
                capUsdDailyChange={this.props.capUsdDailyChange}
                />
                {/*<BalanceChecker col={12} />*/}
                <Button component='a' href="/funds" primary ripple>Funds</Button>
            </Cell>
            <CrowdsaleCardList
                col={4} tablet={4} phone={4}
                title="Active Crowdsales"
                size="small"
                items={this.props.activeCrowdsales} />
            <Cell col={4} tablet={4} phone={4}>
                {/* TODO: create "my portfolio" component */}
                <h5>My Portfolio</h5>
                <div className="mdl-card mdl-shadow--4dp">
                    <h4> {/* TODO move userId into container+property */}
                        ~{Meteor.userId() ? helpers.readableN2(this.props.sumBtc) : 0} bitcoins
                    </h4>
                    <If condition={Boolean(!Meteor.userId())}>
                        <Then>
                            <Button component='a' href="/welcome" primary ripple>Join Us</Button>
                        </Then>
                    </If>
                </div>
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

export default IndexPage
