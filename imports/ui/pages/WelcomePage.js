import React from 'react'
import { Meteor } from 'meteor/meteor'
import { $ } from "meteor/jquery"
import { Button, Grid, Cell } from 'react-mdl'
import Brand from '../components/Brand'
import helpers from '../helpers'

// TODO: test .mdl-cell--stretch on wide element. Dunno if this class works properly

class WelcomePage extends React.Component {
    // redirect user if he is logged in
    componentWillMount() {
        // TODO: move this to FlowRouter.route(triggersEnter: function)
        if(Meteor.userId()) FlowRouter.go('/profile')
    }
    componentDidMount() {
        // self explanatory
        $('[href="/sign-in"]').on('click', () => {
            analytics.track('redirect to Sign In', {
              from: 'welcome'
            })
            FlowRouter.go('/sign-in')
        })
        // make drawer button white
        // conditional css is pretty much non existent
        // TODO create states for drawer button in MainLayout and apply changes through state manipulation
        //$('.mdl-layout__drawer-button').css('color', 'white !important')
    }
    componentWillUnmount() { // clean up
        $('[href="/sign-in"]').remove()
        //$('.mdl-layout__drawer-button').css('color', 'black')
    }
    render() {
        const wideSectionStyle = {
            color: 'white',
            width: '100%',
            background: 'url("/images/blockchain.jpg") no-repeat 0 0',
            backgroundSize: 'cover',
            minHeight: '300px',
            padding: '60px 0'
        }
        return (
                <div id="WelcomePage" className="text-center">
                    <Grid style={wideSectionStyle}>
                        <Cell col={8} tablet={5} phone={12}>
                            <h1><Brand /></h1>
                            <h3>Where the World Discovers Blockchain Systems</h3>
                        </Cell>
                        <Cell col={4} tablet={3} phone={12}>
                            <span>
                                <h5>Control Your Portfolio
                                    <p>Follow Your Favourite Cryptocurrencies</p>
                                    <p>Keep Records of Your Public Keys</p>
                                    <p>Follow the Best Portfolios</p>
                                </h5>
                            </span>
                            <Button href="/sign-in" raised colored ripple>Sign Up with Twitter</Button>
                        </Cell>
                    </Grid>
                    <Grid>
                        <Cell col={12}>
                             <h3>How cyber <span className="red-text">•</span> Fund helps you manage your blockchain portfolio</h3>
                        </Cell>
                    </Grid>
                    <div className="video-container">
                        <iframe width="853" height="480" src="//www.youtube.com/embed/gGbbawSJ6P0?rel=0" frameborder="0" allowfullscreen>
                        </iframe>
                    </div>
                    <Grid>
                        <Cell col={12}>
                            <h4>Sign up now and your public account will be free forever!</h4>
                            <Button href="/sign-in" raised accent ripple>Sign Up</Button>
                        </Cell>
                    </Grid>
                    <hr/>
                    <Grid>
                        <Cell col={12}><h2>Why you’ll love <Brand />.</h2></Cell>
                        <Cell col={4} tablet={4} phone={12}>
                            <i style={{color: '#ff5722', fontSize: '6em'}} className="material-icons">directions_walk</i>
                            <h4>Realtime Valuation</h4>
                            <p>We crunch market data on all blockchains and even for some notable illiquid blockchain assets.</p>
                        </Cell>
                        <Cell col={4} tablet={4} phone={12}>
                            <i style={{color: '#ffeb3b', fontSize: '6em'}} className="material-icons">directions_run</i>
                            <h4>Balance Autoupdate</h4>
                            <p>A majority of the blockchains' balances are updated automatically. Insert your public address and it will be tracked.</p>
                        </Cell>
                        <Cell col={4} tablet={4} phone={12}>
                            <i style={{color: '#4CAF50', fontSize: '6em'}} className="material-icons">directions_bike</i>
                            <h4>Trustless</h4>
                            <p>We invest a lot in blockains too, so we care about your security. We never touch your private keys.</p>
                        </Cell>

                        <br className="clearfix mdl-cell--hide-tablet mdl-cell--hide-phone" />

                        <Cell col={4} tablet={4} phone={12}>
                            <i style={{color: '#2196F3', fontSize: '6em'}} className="material-icons">router</i>
                            <h4>Scanner</h4>
                            <p>We scan all(!) blockchain space for prominent crowdfunding and huge deals.</p>
                        </Cell>
                        <Cell col={4} tablet={4} phone={12}>
                            <i style={{color: '#cddc39', fontSize: '6em'}} className="material-icons">toys</i>
                            <h4>Dispatcher</h4>
                            <p>We filter the noise so only awesome digital
                            assets reach your attention. No scum. No kitchen forks. No middleman.</p>
                        </Cell>
                        <Cell col={4} tablet={4} phone={12}>
                            <i style={{color: '#cddc39', fontSize: '6em'}} className="material-icons">grade</i>
                            <h4>Verifier</h4>
                            <p>We make due diligence free. Really. View all of our
                            unique 4 years investment experiences.
                            Take a look.</p>
                        </Cell>
                    </Grid>
                    <hr/>
                    <Grid>
                        <Cell col={12}>
                            <h4>Welcome to <Brand />!</h4>
                            <Button href="/sign-in" raised colored ripple>Dive In</Button>
                        </Cell>
                        <Cell col={12}>
                            <p>{helpers.usersCount()} people already joined</p>
                        </Cell>
                    </Grid>
                    <hr/>
                    <Grid>
                        <Cell col={12}><h2>For Developers</h2></Cell>
                    </Grid>
                    <Grid>
                        <Cell col={6} tablet={4} phone={12}>
                            <i style={{color: '#ffeb3b', fontSize: '6em'}} className="material-icons">stars</i>
                            <h4>Rating</h4>
                            If you are a developer you can add cryptocurrency or cryptoasset yourself using our opensource Chaingear library.
                            <p>
                                <Button raised colored ripple href="http://cybertalks.org/t/rating-listing-of-cryptocurrencies-and-cryptoassets/353" target="blank">Rating listing</Button>
                            </p>
                        </Cell>
                        <Cell col={6} tablet={4} phone={12}>
                            <i style={{color: '#F44336', fontSize: '6em'}} className="material-icons">directions_run</i>
                            <h4>Radar</h4>
                            You excited about creating or already working on blockchain project you have awesome option to list your project in Radar section of cyber•Fund.
                            <p>
                            <Button raised colored ripple href="http://cybertalks.org/t/radar-listing-of-cryptocurrencies-and-cryptoassets/354" target="blank">Radar listing</Button>
                            </p>
                        </Cell>
                    </Grid>
                </div>
        )
    }
}


export default WelcomePage
