import React, { PropTypes } from 'react'
import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { _ } from 'meteor/underscore'
import get from 'oget'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'

/**
 * Dialog with action buttons. The actions are passed in as an array of React objects,
 * in this example [FlatButtons](/#/components/flat-button).
 *
 * You can also close this dialog by clicking outside the dialog, or with the 'Esc' key.
 */
class AddAddress extends React.Component {
	constructor(props) {
		super(props)
		this.state = { open: false }
		this.handleClose = this.handleClose.bind(this)
		this.handleOpen = this.handleOpen.bind(this)
	}
	handleOpen() {
		this.setState({open: true})
	}

	handleClose() {
		this.setState({open: false})
	}

	render() {
		const { handleOpen, handleClose, state } = this
		const actions = [
		  <FlatButton
		    label="Cancel"
		    primary={true}
		    onTouchTap={handleClose}
		  />,
		  <FlatButton
		    label="Submit"
		    primary={true}
		    keyboardFocused={true}
		    onTouchTap={handleClose}
		  />
		]

		return 	<div>
					<FloatingActionButton secondary={true} className='fab'>
						<ContentAdd />
					</FloatingActionButton>
			        <Dialog
			          title="Dialog With Actions"
			          actions={actions}
			          modal={false}
			          open={state.open}
			          onRequestClose={handleClose}
			        >
			          The actions in this window were passed in as an array of React objects.
			        </Dialog>
				</div>
	}
}

export default AddAddress
