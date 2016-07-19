import React, { PropTypes } from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Grid, Cell, Card, Icon, Button } from 'react-mdl'
import { _ } from 'meteor/underscore'
import { Show, Hide, If, Else } from '../components/Utils'
import Image from '../components/Image'
import AddressesLists from '../components/AddressesLists'
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
	render() {
		const 	{ props, props: { account } } = this,
				{
					isOwnAssets,
					userHasPublicAccess,
					readableN2,
					readableN4
								} = helpers
		const 	icon = name => <i className='material-icons'>{name}</i>,
		lastUpdated = account.updatedAt ? helpers.dateFormat(account.updatedAt) : 'never'
		const chip = 	<Chip backgroundColor={blue300}>
							Colored Chip
						</Chip>
		// TODO move this into helpers (or mayber create special service module?)
		function isPublicAccount(account) {
		  return account && !account.isPrivate;
		}
		function publicity(account) {
		  return isPublicAccount(account) ? icon('public') : icon('vpn_lock')
		}
		function displayBtcUsd(vBtc, vUsd) {
			if (vUsd && vBtc) return `Ƀ${readableN4(vBtc)}/$${readableN2(vUsd)}` // ()
			if (vUsd || vBtc) return vBtc ? `Ƀ${readableN4(vBtc)}` : `$${readableN2(vUsd)}`
			return ''
		}

		return  <Cell col={12} shadow={4} className='mdl-card' account-id={account._id}>
					<Toolbar>
						<ToolbarGroup>
							<ToolbarTitle text={account.name} />
							<ToolbarTitle text={publicity()}/>
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
									<MenuItem primaryText="Rename" leftIcon={icon('edit')} />
									<MenuItem primaryText="Delete" leftIcon={icon('delete')} />
									<If condition={userHasPublicAccess()}>
										<MenuItem
											primaryText="Toggle privacy" leftIcon={icon(isPublicAccount(account) ? 'vpn_lock' : 'public')}
										/>
									</If>
								</IconMenu>
							</Show>
						</ToolbarGroup>
					</Toolbar>

					<AddressesLists
						title={displayBtcUsd(account.vBtc, account.vUsd)}
						addresses={account.addresses}
						getSystem={props.systemData}
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
		publicity(account) {
		  var pub = "Public Account";
		  var pri = "Private Account";
		  return isPublicAccount(account) ? pub : pri;
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
