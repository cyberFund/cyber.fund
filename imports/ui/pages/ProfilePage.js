// functions
import React, { Component, PropTypes }  from 'react'
import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'
import get from 'oget'
import helpers from '../helpers'
// components
import { Grid, Cell, FABButton, Icon, Button, Tabs, Tab } from 'react-mdl'
import { If, Else, Unless, Hide } from '../components/Utils'
import Brand from '../components/Brand'
import Image from '../components/Image'
import SystemsList from '../components/SystemsList'
import AccountsTotalTable from '../components/AccountsTotalTable'
// TODO check this dependency
// import PortfolioTableContainer from '../containers/PortfolioTableContainer'
import PortfolioTable from '../components/PortfolioTable'
import PortfolioChart from '../components/PortfolioChart'
import UsersList from '../components/UsersList'
import AddAccount from '../components/AddAccount'
import AssetsManager from '../components/AssetsManager'
// HOC's
import PageLoading from '../higherOrderComponents/PageLoading'

class ProfilePage extends Component {

	state = {
		activeTab: 0,
		firstTabStyle: {display: 'initial'},
		secondTabStyle: {display: 'none'}
	}

	changeTab = (activeTab) => {
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
		Meteor.logout()
		analytics.track('Sign Out', { from: 'profile' })
	}

	toggleFollow = () => {

		if (!Meteor.user()) FlowRouter.go("/welcome")

		// if following == true => unfollow() and vice versa
		const unfollow = this.props.following
		Meteor.call(
			'followUser',
			CF.Profile.currentUid(),
			unfollow ? { unfollow } : undefined,
			err => {
				if(!err) analytics.track(
							unfollow ? 'Followed Person' : 'Followed Person',
							{ personName: CF.Profile.currentUsername() }
						)
			}
		)

	}

    render() {
        const	{props: {user, isOwnProfile, following, userNumber, userAccounts}, state, props} = 	this,
				{toggleFollow, changeTab, handleLogout} 	= 	this,
				listStyle									=	{margin: '0 3px 6px'}

        return 	<Grid id="ProfilePage">

                  <Cell itemScope itemType="http://schema.org/Person" col={3} tablet={3} phone={4} className="mdl-cell--order-12-tablet">
						<Image
						  src={user.largeAvatar}
						  style={{verticalAlign: 'middle', marginTop: 12, maxWidth: '100%'}}
						/>
					<h4 itemProp="name">{get(user, 'profile.name', '')}</h4>
						{/*TODO do we need multiple .grey-text classes?*/}
						<section className="grey-text">
						  <If condition={get(user, 'services.twitter', false)}>
							<a className="grey-text" href={`https://twitter.com/@${user.username}`}>
							  <span itemProp="alternateName">
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
					    </section>
						{/*TODO do we need this .profile-lists wrapper?*/}
						{/* STARRED FOLLOWERS FOLLOWING */}
						<section className="profile-lists">
							<SystemsList systems={props.starred} title='Starred' style={listStyle} />
							<UsersList users={props.followedByUsers} title='Followers' style={listStyle} />
							<UsersList users={props.followingUsers} title='Following' className="avatar-round" style={listStyle} />
						</section>
						{/* LOGOUN BUTTON AND USER NUMBER */}
						<If condition={isOwnProfile}>
							<Button onClick={handleLogout} raised colored ripple>Logout</Button>
							<Hide unless={userNumber <= 400}>
								<p>You are user #{userNumber}</p>
								<p>>We have classified you as group {userNumber <= 100 ? 'A' : 'B'} user</p>
							</Hide>
						</If>
                  </Cell>

				  	{/* TABS SECTION */}

					<Cell col={9} tablet={5} phone={4}>
						{/* TAB SELECTOR */}
						<Tabs activeTab={state.activeTab} onChange={changeTab} ripple>
						    <Tab>Portfolio</Tab>
						    <Tab>Accounts</Tab>
						</Tabs>
						{/* PORTFOLIO TAB */}
						<section style={state.firstTabStyle}>
							<Hide unless={helpers.isOwnAssets() && userAccounts.length == 0}>
						        <h3>Welcome to <Brand />!! Here is short video to help you get started.</h3>
						        <div className="video-container">
						              <iframe width="853" height="480" src="//www.youtube.com/embed/VPQhbLOQIyc?rel=0" frameborder="0" allowfullscreen></iframe>
						        </div>
							</Hide>
							<AccountsTotalTable accounts={userAccounts} />
							<PortfolioChart />
							<PortfolioTable accounts={userAccounts} />
							{/*<PortfolioTableContainer users={userAccounts} />*/}
						</section>
						{/* ACCOUNTS TAB */}
						<AssetsManager style={state.secondTabStyle} accounts={userAccounts} />
					</Cell>
                	{/* "FOLLOW" OR "ADD ADRESS" BUTTON */}
					{/* TODO move condition checking into AddAccount?
						Or will it make code less readable? */}
					<If condition={isOwnProfile}> <AddAccount /> </If>
					<Else condition={isOwnProfile}>
						<FABButton onClick={toggleFollow} colored ripple>
							<Icon name={following ? 'remove circle' : 'person'} />
		                </FABButton>
					</Else>

            	</Grid>
    }
}

// TODO don't forget to add proptypes (reminder: they are same as container returned variables)
ProfilePage.propTypes = {
 //skills: PropTypes.array.isRequired,
 //numberOfSkills: PropTypes.number.isRequired
}

export default PageLoading(ProfilePage)
