import React, { PropTypes } from 'react'
import { Meteor } from 'meteor/meteor'
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
import ContentAdd from 'material-ui/svg-icons/content/add'
import Public from 'material-ui/svg-icons/social/public'
//import People from 'material-ui/svg-icons/social/people'
// import PeopleOutline from 'material-ui/svg-icons/social/people-outline'
import Lock from 'material-ui/svg-icons/action/lock'
import LockOutline from 'material-ui/svg-icons/action/lock-outline'
// custom
import { If, Hide } from '../components/Utils'

class AddAccount extends React.Component {
	constructor(props) {
		super(props)
	  // todo: check user has required thing marked.
	  // not to keep this in profile, as profile intended to be user-modifiable
		const user = Meteor.user()
		const hasAccess = CF.UserAssets.isPrivateAccountsEnabled(user) && CF.User.hasPublicAccess(user)

		this.state = {
			open: false,
			address: '',
			name: '',
			isPublic: false,
			isNewAccount: true,
			selectedAccount: null,
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
	// this hadnles all kind of form change events
	handleChange(type, event) {
		console.warn('handleChange is fired!')
		let state = {} // create empty object
		// create key with a custom name & assign value from event
		state[type] = event.target.value
		this.setState(state)
	}

	handleSubmit() {
		console.log("handleSubmit is fired!")
		const 	{ state: { address, name, selectedAccount, isNewAccount, isPublic } } = this,
				userId = Meteor.userId()

		console.warn(isPublic, name, address)
		// chec	k address
		// use default browser functionality? or use snackbar? or input errors?
		/*if (!address) {
		  Materialize.toast("please enter address", 4000);
		  return false;
		}*/
		/*if (CF.Accounts.addressExists(address, userId)) {
			this.setState({ addressError: 'Address already exists!' })
			return
		}*/
		// check name
		if (!CF.Accounts.accountNameIsValid(name, userId)) {
			this.setState({ nameError: 'Inavalid Name!' })
			return
		}

	    //var name = '';
	    if (isNewAccount) { // add to new account
	      /*if (!name) { // use default browser?
	        Materialize.toast("please enter account name or select existing account", 4000);
	        return
	      }*/
	      /*if (!CF.Accounts.accountNameIsValid(name, userId)) {
	        return
	      }*/
	     // t.$(e.currentTarget).addClass('submitted');

		 Meteor.call("cfAssetsAddAccount", {
		   isPublic, name, address
		   }, (err, succes)=> {
			   //if(err) // TODO: what should be done if error occurs?
			   // TODO: create snackbar component and add snackbar here
			   if(succes) {
				   analytics.track('Created Account', {
					 accountName: name
				   })
				   analytics.track('Added Address', {
					 accountName: name,
					 address: address
				   })
				   this.toggleDialog()
			   }
		 })
		  // FIXME do i need this returns?
	      return
	    } else { // add to existing account
	    //   var selected = t.$selectAccount.val().trim();
		//  TODO dont forget to add required to select
	    //   if (!accountId) {
	    //     Materialize.toast("Please select account to add to", 4000);
	    //     return false;
	    //   }
	    //   name = $("option:selected", t.$selectAccount).text();
		//
	    //   analytics.track('Added Address', {
	    //     accountName: name,
	    //     address: address
	    //   });
	    //   Meteor.call("cfAssetsAddAddress", accountId, address, function (err, ret) {
	    //     t.$("#modal-add-account").closeModal();
	    //     t.$newAccountName.val("");
	    //     t.$address.val("");
	    //     return false;
	    //   });
	    }
	  // FIXME do i need this returns?
	    return false
	}

	render() {
		const { toggleDialog, handleSubmit, handleChange,  state } = this

		const dialogButtons = [
							<FlatButton
								label="Cancel"
								primary={true}
								onTouchTap={toggleDialog}
							/>,
							<FlatButton
								label="Add" // "Submit"
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
								required
							/>
							<Hide unless={state.userAccounts}>
								<Subheader>Add address to:</Subheader>
								<RadioButtonGroup name="shipSpeed" defaultSelected="existing">
									<RadioButton value="existing" label="Existing account" />
									{/* TODO do not forget to make disabled state */}
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
							<TextField
								hintText="Account name"
								onChange={handleChange.bind(this, 'name')}
								errorText={state.nameError}
								fullWidth
								required
							/>
							<RadioButtonGroup onChange={handleChange.bind(this, 'isPublic')} name="Account Type" defaultSelected="false">
								<RadioButton
									label="Public"
									value={true}
									checkedIcon={<Public />}
	        						uncheckedIcon={<Public />}
								/>
								<RadioButton
									label="Private"
									value={false}
									checkedIcon={<Lock />}
									uncheckedIcon={<LockOutline />}
								/>
							</RadioButtonGroup>
						</form>
			        </Dialog>
				</section>
	}
}

export default AddAccount
