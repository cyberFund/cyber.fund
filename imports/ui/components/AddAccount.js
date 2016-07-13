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

class AddAccount extends React.Component {
	constructor(props) {
		super(props)
		// TODO: check user has required thing marked.
		// not to keep this in profile, as profile intended to be user-modifiable
		// const user = Meteor.user()
		// const hasAccess = CF.UserAssets.isPrivateAccountsEnabled(user) && CF.User.hasPublicAccess(user)
		// TODO what can be removed?
		// after submit form will be reset using this object
		this.initialState = {
			open: false,
			address: '',
			name: '',
			isPublic: false,
			isNewAccount: _.isEmpty(props.userAccounts),
			selectedAccount: '',
			nameError: '',
			addressError: '',
			selectError: ''
			// disabledTogglePrivacy: hasAccess ? '' : 'disabled',
			// privacyState: CF.User.hasPublicAccess(user) ? '' : 'checked'
		}
		this.state = this.initialState
		this.toggleDialog = this.toggleDialog.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	toggleDialog() {
		this.setState({open: !this.state.open})
	}
	// this hadnles all kind of form change events
	// this arguments are part of Material-ui onChange events
	handleChange(key, event, value, selectValue) {
		console.warn('handleChange is fired!')
		// radio button value cannot be boolean
		if (value == 'true' || value == 'false') value = JSON.parse(value)
		let object = {} // create empty object
		// create key with a custom name
		object[key] = selectValue || value
		this.setState(object)
	}

	handleSubmit() {
		console.log("handleSubmit is fired!")
		const 	{ state: { address, name, selectedAccount, isNewAccount, isPublic } } = this,
				userId = Meteor.userId()
		console.warn(isNewAccount, isPublic, name, address)
		// check address
		if (!address) {
			this.setState({ addressError: "Please enter address" })
			return
		}
		if (CF.Accounts.addressExists(address, userId)) {
			this.setState({ addressError: 'Address already exists!' })
			return
		}

	    if (isNewAccount) { // add to new account
			// check name
			if (!name) {
				this.setState({ nameError: 'Please enter name' })
				return
			}
			if (!CF.Accounts.accountNameIsValid(name, userId)) {
				this.setState({ nameError: 'Address already exists' })
				return
			}
			// insert data
			Meteor.call("cfAssetsAddAccount", { isPublic, name, address },
				(err, succes)=> {
					console.warn('cfAssetsAddAccount is called!')
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
					console.warn('cfAssetsAddAccount is called!')
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
				dialogButtons = [
							<FlatButton
								label="Cancel"
								primary={true}
								onTouchTap={toggleDialog}
							/>,
							<FlatButton
								label="Add"
								primary={true}
								//keyboardFocused={true}
								onTouchTap={handleSubmit}
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
							<TextField
								hintText="Address"
								//floatingLabelText="Address"
								autoFocus
								onChange={handleChange.bind(this, 'address')}
								value={state.address}
								errorText={state.addressError}
								fullWidth
							/>
							<Hide unless={props.userAccounts}>
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
										{/*<MenuItem value='' primaryText="Choose account" disabled />*/}
										{props.userAccounts.map(
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
									onChange={handleChange.bind(this, 'name')}
									errorText={state.nameError}
									fullWidth
								/>
								{/* TODO dont forget to hide this part */}
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

AddAccount.propTypes = {
	userAccounts: PropTypes.array.isRequired
}

export default createContainer(() => {
	const userId = Meteor.userId()
	return {
		userAccounts: CF.Accounts.findByRefId(userId).fetch()
	}
}, AddAccount)
