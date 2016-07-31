import React, { Component, PropTypes } from 'react'
import { Meteor } from 'meteor/meteor'
import helpers from '../helpers'
import { Hide } from '../components/Utils'
import { Button,  Grid, Cell } from 'react-mdl'
import Top5AssetsContainer from '../containers/Top5AssetsContainer'
import CybernomicsCap from '../components/CybernomicsCap'
//import BalanceChecker from '../components/BalanceChecker'
import CrowdsaleCardList from '../components/CrowdsaleCardList'
import PageLoading from '../higherOrderComponents/PageLoading'

const IndexPage = props => {
    return <div id="IndexPage" className="text-center">

        {/* HEADERS */}
        <Grid>
          <Cell col={12}>
            <h2>Blockchains Grow Here</h2>
            <h5>{props.usersCount} people are ready to invest in {props.coinsCount} groundbreaking systems</h5>
          </Cell>
        </Grid>

        {/* ASSETS TABLE */}
        <Top5AssetsContainer systems={props.systems}>{/* component */}
          <Cell col={12} className="text-center">{/* components children */}
            <Button component="a" href="/rating" style={{margin: '0 5px'}} raised colored>Start Investing</Button>
            <Button component="a" href="/listing" style={{margin: '0 5px'}} raised disabled>Attract Investments</Button>
          </Cell>
		</Top5AssetsContainer>

        {/* WIDGETS */}
        <Grid> {/* TODO: move Cell into <DayliWidget /> ? */}
            <Cell col={4} tablet={4} phone={4}>
                <h5>Daily Widget</h5>
                <CybernomicsCap
					col={12}
	                capUsd={props.capUsd}
	                capBtc={props.capBtc}
	                capBtcDailyChange={props.capBtcDailyChange}
	                capUsdDailyChange={props.capUsdDailyChange}
                />
                {/*<BalanceChecker col={12} />*/}
                <Button component='a' href="/funds" primary ripple>Funds</Button>
            </Cell>
            <CrowdsaleCardList
                col={4} tablet={4} phone={4}
                title="Active Crowdsales"
                size="small"
				titleComponent='h5'
                items={props.activeCrowdsales}
			/>
            <Cell col={4} tablet={4} phone={4} className="mdl-cell--2-offset-tablet">
                {/* TODO: create "my portfolio" component */}
                <h5>My Portfolio</h5>
                <div className="mdl-card mdl-shadow--4dp" style={{width: '100%'}}>
                    <h4> {/* TODO move userId into container+property */}
                        ~{Meteor.userId() ? helpers.readableN2(props.sumBtc) : 0} bitcoins
                    </h4>
                    <Hide condition={Meteor.userId()}>
                        <Button component='a' href="/welcome" primary ripple>Join Us</Button>
                    </Hide>
                </div>
            </Cell>
        </Grid>

      </div>
}

IndexPage.propTypes = {
	capUsd: PropTypes.number.isRequired,
	capBtc: PropTypes.number.isRequired,
	capUsdDailyChange: PropTypes.number.isRequired,
	capBtcDailyChange: PropTypes.number.isRequired,
	sumBtc: PropTypes.number.isRequired,
	usersCount: PropTypes.number.isRequired,
	coinsCount: PropTypes.number.isRequired,
	activeCrowdsales: PropTypes.array.isRequired,
	loaded: PropTypes.bool.isRequired
}

export default PageLoading(IndexPage)
