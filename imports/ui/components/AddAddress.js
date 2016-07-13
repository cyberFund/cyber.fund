import React, { PropTypes } from 'react'
import { Meteor } from 'meteor/meteor'

import { If, Hide } from '../components/Utils'
import { Grid, Cell, Switch, RadioGroup, Radio } from 'react-mdl'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Toggle from 'material-ui/Toggle'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import ActionFavorite from 'material-ui/svg-icons/action/favorite'
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border'
import Subheader from 'material-ui/Subheader'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField'

class AddAddress extends React.Component {
	constructor(props) {
		super(props)
	  // todo: check user has required thing marked.
	  // not to keep this in profile, as profile intended to be user-modifiable
		const user = Meteor.user();
		const hasAccess = CF.UserAssets.isPrivateAccountsEnabled(user) && CF.User.hasPublicAccess(user)

		this.state = {
			open: false,
			addressError: '',
			nameError: '',
			disabledTogglePrivacy: hasAccess ? '' : 'disabled',
			privacyState: CF.User.hasPublicAccess(user) ? '' : 'checked',
			userAccounts: CF.Accounts.findByRefId(Meteor.userId())
		}
		this.toggleDialog = this.toggleDialog.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	toggleDialog() {
		this.setState({open: !this.state.open})
	}

	handleSubmit() {
		console.log("handleSubmit is fired!")
	}

	render() {
		const { toggleDialog, handleSubmit, state } = this

		const dialogButtons = [
							<FlatButton
								label="Cancel"
								primary={true}
								onTouchTap={toggleDialog}
							/>,
							<FlatButton
								label="Add" // "Submit"
								primary={true}
								keyboardFocused={true}
								onTouchTap={toggleDialog}
							/>
						]

		return 	<section>
					<FloatingActionButton
						onTouchTap={toggleDialog}
						secondary={true}
						className='fab'
					>
						<ContentAdd />
					</FloatingActionButton>
			        <Dialog
			          title="Add address"
			          actions={dialogButtons}
			          modal={false}
			          open={state.open}
			          onRequestClose={toggleDialog}
			        >
			            <form onSubmit={handleSubmit}>
							{/* TODO add bitcoin regex to validate input (maybe server side has one?) */}
							{/* NOTE check wallet-address-validator @ npm */}
							{/* bitcoin regex == ^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$ */}
							{/* TODO add more adddress types to validation */}
							<TextField hintText="Address" errorText={state.addressError} fullWidth />
							<Hide unless={state.userAccounts}>
								<Subheader>Add address to:</Subheader>
								<RadioButtonGroup name="shipSpeed" defaultSelected="existing">
								  <RadioButton value="existing" label="Existing account" />
								  <RadioButton value="new" label="New account" disabled={true} />
								</RadioButtonGroup>
								<SelectField
									floatingLabelText="Select account"
									value={this.state.value}
									onChange={this.handleChange}
								>
									<MenuItem value="" primaryText="Choose account" disabled />
									{state.userAccounts.map(
										item => <MenuItem value={item._id} primaryText={item.name} />
									)}
								</SelectField>
							</Hide>
							<TextField hintText="Account name" errorText={state.nameError} fullWidth />
							<RadioButtonGroup name="Account Type" defaultSelected="private">
							  <RadioButton value="public" label="Public" />
							  <RadioButton value="private" label="Private" />
							</RadioButtonGroup>
						</form>
			        </Dialog>
				</section>
	}
}

export default AddAddress
