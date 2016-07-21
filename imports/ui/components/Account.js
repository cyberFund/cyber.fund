import React, { PropTypes } from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Grid, Cell, Card, Icon, Button } from 'react-mdl'
import { _ } from 'meteor/underscore'
import { Show, Hide, If, Else } from '../components/Utils'
import Image from '../components/Image'
import AddressesLists from '../components/AddressesLists'
import Confirm from '../components/Confirm'
import Prompt from '../components/Prompt'
import helpers from '../helpers'

import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import Chip from 'material-ui/Chip';
import {blue300, indigo900} from 'material-ui/styles/colors';

// var cfCDs = CF.CurrentData .selectors;
// CF.Accounts.currentAddress = new CF.Utils.SessionVariable("cfAccountsCurrentAddress");
// CF.Accounts.currentAsset = new CF.Utils.SessionVariable("cfAccountsCurrentAsset");

class Account extends React.Component {
	constructor(params) {
		super(params)
		this.state = {
			confirmIsOpen: false,
			promptIsOpen: false,
			promptText: '',
			promptError: ''
		}
		this.handleDelete = this.handleDelete.bind(this)
		this.handleRename = this.handleRename.bind(this)
		this.handlePromptChange = this.handlePromptChange.bind(this)
		this.handlePrivacyToggle = this.handlePrivacyToggle.bind(this)
	}

	handleDelete() {

		const accountName = this.props.account._id
		Meteor.call(
					"cfAssetsRemoveAccount",
					accountName,
					(err)=> { // if no error occured submit analytics data
						if(!err) analytics.track(
									"Deleted Account",
									{ accountName }
								)
					}
		)

	}

	handlePrivacyToggle() {

		Meteor.call(
			"cfAssetsTogglePrivacy",
			this.props.account._id,
			CF.UserAssets.getAccountPrivacyType( this.props.account._id ),
			function(err) {
				if (err) console.error(err)
				// TODO add snackbar
				// else console.warn('handlePrivacyToggle SUCCES!')
		})

	}

	handleUpdate() {
		console.warn('handleUpdate')
		// FIXME implement update


		// Meteor.call("cfAssetUpdateBalance",
		// 	CF.Accounts.currentId.get(),
		// 	CF.Accounts.currentAddress.get()
		// )
		// "click .req-update-balance.per-address": function(e, t) { //todo: add checker per account/ per user
		//   //if (!isOwnAssets()) return;
		//
		//   var $t = t.$(e.currentTarget);
		//   var uid = $t.closest(".assets-manager").attr("owner");
		//   $t.addClass("disabled");
		//
		//   Meteor.call("cfAssetsUpdateBalances", {
		// 	username: Meteor.user() && Meteor.user().username,
		// 	accountKey: CF.Accounts.currentId.get(),
		// 	address: CF.Accounts.currentAddress.get()
		//   }, function(er, re) {
		// 	$t.removeClass("disabled");
		//   });
		// },
		// "click .per-account": function(e, t) {
		//   //if (!isOwnAssets()) return;
		//   var accountKey = t.$(e.currentTarget).closest(".account-item").attr("account-id");
		//   CF.Accounts.currentId.set(accountKey.toString());
		// },
		//
		// "click .req-update-balance.per-account": function(e, t) {
		//   //todo: add checker per account/ per user
		//   //if (!isOwnAssets()) return;
		//
		//   var $t = t.$(e.currentTarget);
		//
		//   var uid = $t.closest(".assets-manager").attr("owner");
		//   $t.addClass("disabled");
		//   //$(".req-update-balance.per-address", $t.closest(".account-item"))
		//   //.addClass("disabled");
		//
		//   Meteor.call("cfAssetsUpdateBalances", {
		// 	userId: Meteor.userId(),
		// 	accountKey: CF.Accounts.currentId.get()
		// 	  //  address: CF.Accounts.currentAddress.get()
		//   }, function(er, re) {
		// 	$t.removeClass("disabled");
		// 	//$ (".req-update-balance.per-address", $t.closest(".account-item"))
		// 	//.removeClass("disabled");
		//   });
		// },
	}

	handleRename() {
		const { account } = this.props
		const { promptText, promptError } = this.state
		// do nothing on error
		if(promptError) return
		// or make a call
		Meteor.call(
			"cfAssetsRenameAccount",
			account._id, promptText,
			(err)=> {
				if(err) this.setState({ errorText: err.reason })
				else {
					// clean up
					this.setState({
						promptText: '',
						promptError: '',
						promptIsOpen: false
					})
					// submit analytics data
					analytics.track("Renamed Account", {
						oldName: account.name,
						newName: promptText
					});
				}
			}
		)
	}

	handlePromptChange(event) {
		const promptText = event.target.value
		let errorText = ''

		// check if account name already exists
		if ( !CF.Accounts.accountNameIsValid(promptText, Meteor.userId()) ) {
			errorText = 'Account with that name already exists'
			// do not show error if input is empty
			if (promptText == '') errorText = ''
		}

		this.setState({ promptText, errorText })
	}

	render() {
		const 	{ state, props, props: { account } } = this,
				{ isOwnAssets, userHasPublicAccess, displayBtcUsd } = helpers,
				lastUpdated = account.updatedAt ? helpers.dateFormat(account.updatedAt) : 'never'
		// const chip = 	<Chip backgroundColor={blue300}>
		// 					Colored Chip
		// 				</Chip>

		const 	icon = name => <i className='material-icons'>{name}</i>
		const publicityIcon = icon( account.isPrivate ? 'public' : 'vpn_lock' )
		console.warn(account.isPrivate)
		console.warn(account)

		return  <Cell col={12} shadow={4} className='mdl-card' account-id={account._id}>
					<Toolbar>
						<ToolbarGroup>
							<ToolbarTitle text={account.name} />
							<ToolbarTitle text={publicityIcon}/>
						</ToolbarGroup>
						<ToolbarGroup>
							<IconButton tooltip={`last updated at: ${lastUpdated}`}>
					    		{icon('loop')}
						    </IconButton>
							<Show condition={isOwnAssets()}>
								<IconMenu
									iconButtonElement={
										<IconButton touch={true}>
											<MoreVertIcon />
										</IconButton>
									}
									// bottom-left position of menu items
									anchorOrigin={{horizontal: 'right', vertical: 'top'}}
									targetOrigin={{horizontal: 'right', vertical: 'top'}}
								>
									<MenuItem primaryText="Rename" onClick={()=> this.setState({promptIsOpen: true})} leftIcon={icon('edit')} />
									<MenuItem primaryText="Delete" onClick={() => this.setState({confirmIsOpen: true})} leftIcon={icon('delete')} />
									<If condition={userHasPublicAccess()}>
										<MenuItem
											primaryText="Toggle privacy"
											onClick={this.handlePrivacyToggle}
											leftIcon={publicityIcon}
										/>
									</If>
								</IconMenu>
							</Show>
						</ToolbarGroup>
					</Toolbar>

					{/* ADDRESSES */}
					<AddressesLists
						title={`(${ displayBtcUsd(account.vBtc, account.vUsd) })`}
						addresses={account.addresses}
						getSystem={props.systemData}
					/>

					{/* DIALOGS */}
					<Confirm
						title={`Confirm deletion of "${account.name}" account`}
						open={state.confirmIsOpen}
						confirmText='delete'
						onConfirm={this.handleDelete}
						onCancel={ ()=> this.setState({ confirmIsOpen: false }) }
					/>
					<Prompt
						title={`Rename account ${account.name}`}
						label='New name'
						defaultValue={account.name}
						open={state.promptIsOpen}
						onSubmit={this.handleRename}
						onChange={this.handlePromptChange}
						onCancel={ ()=> this.setState({ promptIsOpen: false }) }
						errorText={state.errorText}
					/>
				</Cell>
	}
}

Account.propTypes = {
	// FIXME <Account account={props.account} /> seems stupid? What is should be renamed to?
	// 'data', 'item', 'object', 'asset' ?
	account: PropTypes.object.isRequired
}
export default createContainer( props => {

	// FIXME this is a mess. What variables actually used in code?
	const 	{account} 	= props,
			{selectors} = CF.CurrentData


	CF.Accounts.currentAddress = new CF.Utils.SessionVariable("cfAccountsCurrentAddress")
	CF.Accounts.currentAsset = new CF.Utils.SessionVariable("cfAccountsCurrentAsset")


	function isPublicAccount(account) {
	  return !account.isPrivate;
	}

	return {
		disabledTogglePrivate() {
		  return "disabled";
		},
		isPublic(account) {
		  return isPublicAccount(account);
		},
		systemData(name) {
		  return CurrentData.findOne(selectors.system(name)) || {};
		},
		name_of_system() {
			return account.key
		}
	}
}, Account)
