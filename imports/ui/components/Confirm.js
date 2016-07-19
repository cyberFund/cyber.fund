import React, { PropTypes } from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

// component works like this:
// <Confirm
// 	title='Delete address'
// 	open={state.openDialog}
// 	onConfirm={this.someCallback}
// 	onCancel={this.closeDialog}
// />

const Confirm = props => {
	
	const 	dialogButtons = [
						<FlatButton
							label={props.cancelText}
							onTouchTap={props.onCancel}
							primary={true}
						/>,
						<FlatButton
							label={props.confirmText}
							keyboardFocused={true}
							onTouchTap={props.onConfirm}
							primary={true}
						/>
					]

	return 	<Dialog
	          title={props.title}
	          actions={dialogButtons}
	          modal={false}
	          open={props.open}
	          onRequestClose={props.onCancel}
	        >
				{props.children}
	        </Dialog>
}

Confirm.propTypes = {
	open: PropTypes.bool.isRequired,
	onCancel: PropTypes.func.isRequired,
	onConfirm: PropTypes.func.isRequired,
	title: PropTypes.string,
	confirmText: PropTypes.string,
    cancelText: PropTypes.string
}

Confirm.defaultProps = {
	title: 'Are you sure?',
	confirmText: 'confirm',
	cancelText: 'cancel'
}

export default Confirm
