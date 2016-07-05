import React, { Component, PropTypes }  from 'react'
import { Meteor } from 'meteor/meteor'
import { Grid, Cell, FABButton, Icon, Button, Tabs, Tab } from 'react-mdl'
import get from 'oget'
import helpers from '../helpers'
import { If, Unless } from '../components/Utils'
import Loading from '../components/Loading'
import Brand from '../components/Brand'
import Image from '../components/Image'
import SystemsList from '../components/SystemsList'
import PortfolioTableContainer from '../containers/PortfolioTableContainer'
import UsersList from '../components/UsersList'
// TODO sort check dependencies usage

class ProfilePage extends Component {
    constructor(props) {
    	super(props)
    	this.state = {
			activeTab: 0,
			firstTabStyle: {display: 'initial'},
			secondTabStyle: {display: 'none'}
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
	handleLogout() {
		console.warn('User logout fired!')
		Meteor.logout() && analytics.track('Sign Out', { from: 'profile' })
	}

    render() {
        const {props, state, changeTab, props: {user, isOwnProfile}} = this
        return props.loaded ? (
              <Grid id="ProfilePage">
                  {/* USER INFO */}
                  <Cell itemscope itemtype="http://schema.org/Person" col={3} tablet={3} phone={4} className="mdl-cell--order-12-tablet">
						<Image
						  src={user.largeAvatar}
						  style={{verticalAlign: 'middle', marginTop: 12, maxWidth: '100%'}}
						  />
						<h4 itemprop="name">{user.profile.name}</h4>
						{/*TODO do we need multiple .grey-text classes?*/}
						<div className="grey-text">
						  <If condition={get(user, 'services.twitter', false)}>
							<a className="grey-text" href={`https://twitter.com/@${user.username}`}>
							  <span itemprop="alternateName">
								  @{user.username}
							  </span>
							</a>
						  </If>
						  <Unless condition={get(user, 'services.twitter')}>
							  <span className="grey-text">{user.username}</span>
						  </Unless>
						  <div>
							  Joined on {helpers.dateFormat(user.createdAt, "Do MMM, YYYY")}
						  </div>
						</div>
						{/*TODO do we need this .profile-lists wrapper?*/}
						<div class="profile-lists">
							<h5>Starred</h5>
							<SystemsList systems={props.starred} style={{margin: '0 3px 6px'}} />
							<h5>Followers</h5>
							<UsersList users={props.followedByUsers} style={{margin: '0 3px 6px'}} />
							<h5>Following</h5>
							<UsersList users={props.followingUsers} className="avatar-round" style={{margin: '0 3px 6px'}} />
						</div>
						{/* logout button */}
						<If condition={isOwnProfile}>
							<Button onClick={this.handleLogout} raised colored ripple>Logout</Button>
						</If>
                  </Cell>
					<Cell col={9} tablet={5} phone={4} className="text-center">
						{/* TAB SELECTOR */}
						<Tabs activeTab={state.activeTab} onChange={changeTab.bind(this)} ripple>
						    <Tab>Portfolio</Tab>
						    <Tab>Accounts</Tab>
						</Tabs>
						{/* PORTFOLIO TAB */}
						<section style={state.firstTabStyle}>
						        <h3>Welcome to <Brand />!! Here is short video to help you get started.</h3>
						        <div className="video-container">
						              <iframe width="853" height="480" src="//www.youtube.com/embed/VPQhbLOQIyc?rel=0" frameborder="0" allowfullscreen></iframe>
						        </div>
						        <PortfolioTableContainer users={props.userAccounts} />
						</section>
						{/* ACCOUNTS TAB */}
						<section style={state.secondTabStyle}>
						    <h4><i>nothing here yet...</i></h4>
						</section>
					</Cell>
                  	{/* RED FLOATING BUTTON */}
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
      }
    });*/

}
// TODO don't forget to add proptypes (reminder: they are same as container returned variables)
ProfilePage.propTypes = {
 //skills: PropTypes.array.isRequired,
 //numberOfSkills: PropTypes.number.isRequired
}

export default ProfilePage
