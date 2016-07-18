// dependencies
import React, { PropTypes } from 'react'
import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { createContainer } from 'meteor/react-meteor-data'
import { Grid, Cell, Switch, RadioGroup, Radio } from 'react-mdl'
// material-ui
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import Subheader from 'material-ui/Subheader'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField'
// icons
import ContentAdd from 'material-ui/svg-icons/content/add' 			// floating button
import Existing from 'material-ui/svg-icons/av/library-books'		// new\existing checkbox
import New from 'material-ui/svg-icons/av/library-add' 				// new\existing checkbox
import Public from 'material-ui/svg-icons/social/public' 			// public\private checkbox
import Lock from 'material-ui/svg-icons/action/lock'				// public\private checkbox
import LockOutline from 'material-ui/svg-icons/action/lock-outline' // public\private checkbox
// custom
import { If, Show, Hide } from '../components/Utils'
// TODO dont forget to clean up & refactor
export default class AddAccount extends React.Component {
	constructor(props) {
		super(props)
		const userAccounts = CF.Accounts.findByRefId( Meteor.userId() ).fetch()
		// initial state will be reused after form submit
		this.initialState = {
			open: false,
			address: '',
			name: '',
			isPublic: false,
			isNewAccount: _.isEmpty(userAccounts),
			// if there is only one account, autoselect it
			selectedAccount: userAccounts && userAccounts.length == 1 ? userAccounts[1] : '',
			nameError: '',
			addressError: '',
			selectError: '',
			userAccounts
		}
		this.state = this.initialState

		// bindings
		this.toggleDialog = this.toggleDialog.bind(this)
		this.handleAddressChange = this.handleAddressChange.bind(this)
		this.handleNameChange = this.handleNameChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	toggleDialog() { this.setState({ open: !this.state.open }) }

	// this handless checkbox and select changes
	// arguments are part of Material-ui onChange events
	handleChange(key, event, value, selectValue) {
		// radio button value cannot be boolean
		if (value == 'true' || value == 'false') value = JSON.parse(value)
		let object = {} // create empty object
		// create key with a custom name
		object[key] = selectValue || value
		this.setState(object)
	}

	handleAddressChange(event, address) {
		this.setState({ address })
		if (CF.Accounts.addressExists(address, Meteor.userId())) {
			this.setState({ addressError: 'Address already exists!' })
		}
		else this.setState({ addressError: '' })
	}

	handleNameChange(event, name) {
		this.setState({ name })
		if (!CF.Accounts.accountNameIsValid(name, Meteor.userId())) {
			this.setState({ nameError: 'Account with that name already exists' })
		}
		else this.setState({ nameError: '' })
		// somehow CF.Accounts.accountNameIsValid returns false on empty string
		if (name == '') this.setState({ nameError: '' })
	}

	handleSubmit() {
		const 	{ state: { address, name, selectedAccount, isNewAccount, isPublic } } = this,
				userId = Meteor.userId()
		// check address
		if (!address) {
			this.setState({ addressError: "Please enter address" })
			return
		}

	    if (isNewAccount) { // add to new account
			// check name
			if (!name) {
				this.setState({ nameError: 'Please enter name' })
				return
			}
			// insert data
			Meteor.call("cfAssetsAddAccount", { isPublic, name, address },
				(err, succes)=> {
					// TODO: create snackbar component and add snackbar here
					if (err) console.error(err)
					else {
						analytics.track('Created Account', {
							accountName: name
						})
						analytics.track('Added Address', {
							accountName: name,
							address: address
						})
						this.setState( this.initialState )
					}
				}
			)
	    } else { // add to existing account
			// check select
			if (!selectedAccount) {
				this.setState({ selectError: 'Please select account' })
				return
			}
			// insert data
			Meteor.call("cfAssetsAddAddress", selectedAccount, address,
				(err, succes)=> {
					// TODO: create snackbar component and add snackbar here
					if (err) console.error(err)
					else {
						analytics.track('Added Address', {
							accountName: name,
							address: address
						})
						this.setState( this.initialState )
					}
				}
			)
	    }
	}

	render() {
		const 	{ toggleDialog, handleSubmit, handleChange,  state, props } = this,
				// inputs and errors needed to toggle submit button
				inputs = state.address && (state.name || state.selectedAccount),
				errors = state.nameError && state.addressError && state.selectError,
				canSubmit = Boolean(inputs && !errors),
				dialogButtons = [
							<FlatButton
								label="Cancel"
								primary={true}
								onTouchTap={toggleDialog}
							/>,
							<FlatButton
								label="Add"
								disabled={!canSubmit}
								keyboardFocused={canSubmit}
								onTouchTap={handleSubmit}
								primary={true}
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
							{/* TODO add more adddress types to validation */}
							{/* NOTE check wallet-address-validator @ npm
								or https://github.com/cyberFund/quantum */}
							<TextField
								hintText="Address"
								autoFocus
								onChange={this.handleAddressChange}
								value={state.address}
								errorText={state.addressError}
								fullWidth
							/>
						<Hide unless={state.userAccounts}>
								<Subheader>Add address to:</Subheader>
								<RadioButtonGroup
									onChange={handleChange.bind(this, 'isNewAccount')}
									name="isNewAccount"
									defaultSelected="false"
								>
									<RadioButton
										value="false"
										label="Existing account"
										checkedIcon={<Existing />}
										uncheckedIcon={<Existing />}
									/>
									<RadioButton
										value="true"
										label="New account"
										checkedIcon={<New />}
										uncheckedIcon={<New />}
									/>
								</RadioButtonGroup>
								<Hide condition={state.isNewAccount}>
									{/* TODO auto select item if only one exists */}
									<SelectField
										floatingLabelText="Select account"
										value={state.selectedAccount}
										onChange={handleChange.bind(this, 'selectedAccount')}
										errorText={state.selectError}
									>
										{state.userAccounts.map(
											item => <MenuItem
														value={item._id}
														primaryText={item.name}
														key={item._id}
													/>
										)}
									</SelectField>
								</Hide>
							</Hide>
							<If condition={state.isNewAccount}>
								<TextField
									hintText="Account name"
									onChange={this.handleNameChange}
									errorText={state.nameError}
									fullWidth
								/>
								<RadioButtonGroup onChange={handleChange.bind(this, 'isPublic')} name="Account Type" defaultSelected='false'>
										<RadioButton
											label="Public"
											value='true'
											checkedIcon={<Public />}
			        						uncheckedIcon={<Public />}
										/>
										<RadioButton
											label="Private"
											value='false'
											checkedIcon={<Lock />}
											uncheckedIcon={<LockOutline />}
										/>
								</RadioButtonGroup>
							</If>
						</form>
			        </Dialog>
				</section>
	}
}
