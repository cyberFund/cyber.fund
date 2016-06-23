import React, { Component, PropTypes }  from 'react'
import { Grid, Cell, FABButton, Icon, Button, Tabs, Tab } from 'react-mdl'
import {Hide, Show} from '../components/Utils'
import Brand from '../components/Brand'
import Loading from '../components/Loading'
import PortfolioTable from '../components/PortfolioTable'

class ProfilePage extends Component {
    constructor(props) {
    	super(props)
    	this.state = {
			activeTab: 0,
			firstTabStyle: {display: 'initial'},
			secondTabStyle: {display: 'initial'}
		 }
    }
	changeTab(activeTab) {
		this.setState({ activeTab })
		// hide&show elements via display property manipulation instead of changes based on state (<Hide /> component for example)
		// reason: state changes make elements rerender causing embed youtube video to reinitialize multiple times == bad UX
		if (activeTab == 0 ) {
			this.setState({
				firstTabStyle: {display: 'initial'},
				secondTabStyle: {display: 'none'}
			})
		}
		else {
			this.setState({
				firstTabStyle: {display: 'none'},
				secondTabStyle: {display: 'initial'}
			})
		}

	}
    render() {
        const {props, state, changeTab} = this
        return props.loaded ? (
              <Grid id="LoginPage">
                  {/* USER INFO */}
                  <Cell col={3} tablet={12} className="mdl-cell--order-12-tablet">
                      <p>avatar</p>
                      <p>name</p>
                      <p>info</p>
                      <p>starred</p>
                      <p>followers</p>
                      <p>following</p>
                      <p>logout button</p>
                      <Button raised colored ripple>Logout</Button>
                  </Cell>
                  <Cell col={9} tablet={12} className="text-center">
                    <Tabs activeTab={state.activeTab} onChange={changeTab.bind(this)} ripple>
                        <Tab>Portfolio</Tab>
                        <Tab>Accounts</Tab>
                    </Tabs>
                    <section style={state.firstTabStyle}>
                            <h3>Welcome to <Brand />!! Here is short video to help you get started.</h3>
                            <div className="video-container">
                                  <iframe width="853" height="480" src="//www.youtube.com/embed/VPQhbLOQIyc?rel=0" frameborder="0" allowfullscreen></iframe>
                            </div>
                            <PortfolioTable />
                    </section>
					<section style={state.secondTabStyle}>
                        {/* ACCOUNTS */}
                        <h4><i>nothing here yet...</i></h4>
                    </section>
                  </Cell>
                  {/* RED ROUND BUTTON */}
                    <FABButton colored ripple style={{position: 'fixed', right: 24, bottom: 24}}>
                        <Icon name="add" />
                    </FABButton>
              </Grid>
        ) : <Loading />
    }
    /*Template['profile'].events({
      'click .btn-follow': function(e, t) {
        analytics.track('Followed Person', {
          personName: CF.Profile.currentUsername()
        });
        if (!Meteor.user()) FlowRouter.go("/welcome");
        Meteor.call('followUser', CF.Profile.currentUid())
      },
      'click .btn-unfollow': function(e, t) {
        analytics.track('Unfollowed Person', {
          personName: CF.Profile.currentUsername()
        });
        if (!Meteor.user()) FlowRouter.go("/welcome");
        Meteor.call('followUser', CF.Profile.currentUid(), {
          unfollow: true
        })
      },
      'click #at-nav-button': function(e, t) {
        analytics.track('Sign Out', {
          from: 'profile'
        });
        Meteor.logout()
      }
    });*/

}

ProfilePage.propTypes = {
 //skills: PropTypes.array.isRequired,
 //numberOfSkills: PropTypes.number.isRequired
}

export default ProfilePage
