import React, { PropTypes } from 'react'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'

// component works like this:
// <Confirm
// 	title='Delete address'
// 	label='Type your name'
// 	open={state.openDialog}
// 	onChange={this.someCallback}
// 	onSubmit={this.someCallback}
// 	onCancel={this.closeDialog}
// 	errorText='Some text'
// />

const Prompt = props => {

	const 	dialogButtons = [
						<FlatButton
							label={props.cancelText}
							onTouchTap={props.onCancel}
							primary={true}
						/>,
						<FlatButton
							label={props.submitText}
							primary={true}
							keyboardFocused={true}
							onTouchTap={props.onSubmit}
						/>
					]

	return 	<Dialog
	          title={props.title}
	          actions={dialogButtons}
	          modal={false}
	          open={props.open}
	          onRequestClose={props.onCancel}
	        >
				<TextField
					onChange={props.onChange}
					floatingLabelText={props.label}
					errorText={props.errorText}
					autoFocus
					fullWidth
					{...props}
				/>
				{props.children}
	        </Dialog>
}

Prompt.propTypes = {
	open: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	onCancel: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	onChange: PropTypes.func,
	label: PropTypes.text,
	errorText: PropTypes.string,
	submitText: PropTypes.string,
    cancelText: PropTypes.string
}

Prompt.defaultProps = {
	submitText: 'submit',
	cancelText: 'cancel'
}

export default Prompt
