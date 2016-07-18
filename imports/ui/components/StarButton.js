import React, { PropTypes } from 'react'
import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { FABButton, Icon } from 'react-mdl'
import get from 'oget'
import Snackbar from 'material-ui/Snackbar'
import autobind from 'react-autobind'

class StarButton extends React.Component {
	constructor(props) {
		super(props)
		// state.isStarred = user has systemId in starredSystems
		const starredSystems = get(Meteor.user(), 'profile.starredSystems') || []

		this.state = {
			isStarred: starredSystems.includes(this.props.systemId),
			openSnackbar: false,
			message: ''
		}

    	autobind(this)
	}

    toggleStar() {
		const 	{ state: { isStarred }, setState, toggleSnackbar } = this,
				systemName = this.props.systemId

		if (!Meteor.userId()) FlowRouter.go('/welcome')

		// add/remove system to user.starredSystems
		Meteor.call("toggleStarSys", systemName, undefined, (err)=> {
			if (err) this.toggleSnackbar('Something went wrong')
			else {
				// activate changes
				this.setState({ isStarred: !isStarred })
				toggleSnackbar()
				// track changes
				analytics.track(
					isStarred ? "Unfollowed System" : "Followed System",
					{ systemName }
				)
			}
		})
    }

	toggleSnackbar() {
		const { isStarred, openSnackbar } = this.state
		this.setState({
			message: isStarred ? 'System starred!' : 'System unstarred!',
			openSnackbar: !openSnackbar
		})
	}

    render() {
        const 	{ state } = this,
				color = state.isStarred ? 'yellow' : 'white'

		return 	<div>
					<Snackbar
					  open={state.openSnackbar}
					  message={state.message}
					  autoHideDuration={4000}
					  onRequestClose={this.toggleSnackbar}
					/>
					<FABButton
						onClick={this.toggleStar}
						colored
						ripple
					>
						<Icon name="star" style={{color}} />
					</FABButton>
				</div>
    }
}

StarButton.propTypes = {
	systemId: PropTypes.string.isRequired
}

export default StarButton
