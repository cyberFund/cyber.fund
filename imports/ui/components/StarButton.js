import React, { PropTypes } from 'react'
import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { _ } from 'meteor/underscore'
import { FABButton, Icon } from 'react-mdl'
import get from 'oget'

class StarButton extends React.Component {
	constructor(props) {
		super(props)
		// state.starred = user has systemId in starredSystems
		const starredSystems = get(Meteor.user(), 'profile.starredSystems', [])
		this.state = { starred: starredSystems.includes(this.props.systemId) }
	}
    toggleStar() {
		const 	{starred} = this.state,
				systemName = this.props.systemId

		if (!Meteor.userId()) FlowRouter.go('/welcome')

		// add/remove system to user/.starredSystems
		Meteor.call("toggleStarSys", systemName)
		// change icon color
		this.setState({starred: !starred})
		// track changes
		analytics.track(
			starred ? "Unfollowed System" : "Followed System",
			{systemName: systemName}
		)
    }
    render() {
        const 	{props, toggleStar, state} = this,
				color = state.starred ? 'yellow' : 'white'

		/* TODO create .float class and add this styles to it, or just ovveride mdl floating  styles */
		return 	<FABButton
					onClick={toggleStar.bind(this)}
					colored
					ripple
					style={{position: 'fixed', right: 24, bottom: 24}}
				>
					<Icon name="star" style={{color}} />
				</FABButton>
    }
}

StarButton.propTypes = {
	systemId: PropTypes.string.isRequired
}

export default StarButton
