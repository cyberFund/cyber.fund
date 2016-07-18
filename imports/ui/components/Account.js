import React, { PropTypes } from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Grid, Cell, Icon, Button, Tabs, Tab } from 'react-mdl'
import { _ } from 'meteor/underscore'
import { Show, Hide, If, Else } from '../components/Utils'
import Image from '../components/Image'
import helpers from '../helpers'

// var cfCDs = CF.CurrentData .selectors;
// CF.Accounts.currentAddress = new CF.Utils.SessionVariable("cfAccountsCurrentAddress");
// CF.Accounts.currentAsset = new CF.Utils.SessionVariable("cfAccountsCurrentAsset");

class Account extends React.Component {
	render() {
		const 	{ props, props: { account } } = this, //, publicity
				//{ activeTab, displayTabs } = this.state,
				{
					isOwnAssets,
					userHasPublicAccess,
					readableN2,
					readableN4
								} = helpers
		// TODO move this into helpers (or mayber create special service module?)
		function isPublicAccount(account) {
		  return !account.isPrivate;
		}
		function publicity(account) {
		  return isPublicAccount(account) ? "Public Account" : "Private Account"
		}
		function displayBtcUsd(vBtc, vUsd) {
			if (vUsd && vBtc) return `(Ƀ${readableN4(vBtc)}/$${readableN2(vUsd)})`
			if (vUsd || vBtc) return vBtc ? `Ƀ${readableN4(vBtc)}` : `$${readableN2(vUsd)}`
			return ''
		}

				// TODO DO NOT FORGET CHANGE GRID TO CARD
		return  <Grid className="text-center">
			<div className="card ">
		          <div className="account-item row" account-id={account._id}>
		              <div className="row no-bottom-margin">
		                  <div className="right hoverie" style={{marginRight: 10}}>
		                      <a className="req-update-balance per-account btn-floating btn-tiny blue btn-margin-left">
		                          <i
									  className="material-icons small"
									  title={`last updated at: ${account.updatedAt ? helpers.dateFormat(account.updatedAt) : 'never'}`}>
									  loop
								  </i>
		                      </a>
							  <If condition={isOwnAssets()}>
		                          <a className="req-rename-account per-account btn-floating btn-tiny yellow">
									  <i className="material-icons tiny">edit</i>
								  </a>
								  <a className="red-text req-remove-account per-account btn-floating btn-tiny red">
									  <i className="material-icons tiny">delete</i>
								  </a>
								<If condition={userHasPublicAccess()}>
		                          <a className="req-toggle-private per-account grey btn-floating btn-tiny">{/* TODO: add check if user is able using this feature */}
		                              <i className="material-icons tiny">
										  { isPublicAccount(account) ? 'vpn_lock' : 'public' }
									  </i>
								  </a>
								</If>
							  </If>
							</div>
							<h4 style={{marginLeft: 20}}>
								{account.name}
								<Show condition={account.vUsd || account.vBtc}>
									<span className="text-big">
										{displayBtcUsd(account.vBtc, account.vUsd)}
									</span>
								</Show>
								<Hide unless={isOwnAssets()}>
									<span className="portfolio-badge-large green white-text">
										{publicity(account)}
									</span>
								</Hide>
		                	</h4>
						</div>
						{/* add adress button <div style="position: absolute; top: 0; right: 0px">
						                  <a class="btn right per-account req-add-address btn-margin-right">Add address</a>
						              </div>  */}




<ul className="collection adresses-list no-bottom-margin">
	{_.map(account.addresses, (value, key) => {
		// TODO check if "address-id" prop rendered properly in html
		return <li key={key} className="address-item collection-item" address-id={key} style={{marginLeft: 0}}>
			<div style={{marginBottom: 18}}>
				<div style={{marginLeft: 0}}>
					{key}
					<span>
						{displayBtcUsd(value.vBtc, value.vUsd)}
					</span>
					<span className="portfolio-badge red white-text">Unverified Address</span>
				</div>
				<div className="hoverie" style={{position: 'absolute', top: 10, right: 0}}>
					<If condition={isOwnAssets()}>
						<a className="btn-floating btn-small green per-address req-add-asset-to-address">
							<i className="material-icons small">add</i>
						</a>
						<a className="btn-floating btn-small red per-address req-delete-address btn-margin-right">
							<i className="material-icons small">delete</i>
						</a>
					</If>
				</div>
			</div>
			<ul className="collection assets-list">
				{/* TODO check if "asset-key" prop is properly rendered */}
				{_.map(value.assets, (value, key) => {
					return 	<li key={key} className="collection-item asset-item" asset-key={key}>
								<a href={`/system/${helpers._toUnderscores(key)}`}>
									<Image src={props.systemData(key)} avatar />
									{helpers.displaySystemName(props.systemData(key))}
								</a>
								: {value.quantity} {helpers.displayCurrencyName(key)}s
							</li>
				})}
			</ul>
		</li>
	})}
</ul>

{/*

	<ul class="collection assets-list">
		{{#each keyValue value.assets}}
			<li class="collection-item asset-item"
				asset-key="{{key}}">
				<a href="{{pathFor '/system/:name_' name_=(_toUnderscores name_of_system)}}">
					{{> cgSystemLogo system=systemData class="logo-portfolio"}}
					{{displaySystemName systemData}}
				</a>
				: {{value.quantity}} {{displayCurrencyName key}}s
				{{#with value}}
				{{#if or vUsd vBtc}}({{#if vBtc}}Ƀ{{readableN4 vBtc}}{{/if}}
				  {{#if and vUsd vBtc}}/{{/if}}
				  {{#if vUsd}}${{readableN2 vUsd}}{{/if}}){{/if}}{{/with}}
					<div class="secondary-content hoverie"
						 style="margin-right: 12px;">

						{{#if eq value.update 'auto'}}
							<span class="portfolio-badge amber white-text">
						Autoupdate</span>
						{{/if}}

						{{#if eq value.update 'manual'}}
							<span class="portfolio-badge green white-text">
						Manually entered</span>
						{{/if}}
						{{#if isOwn}}
							{{#if eq value.update 'manual'}}
							<a class="btn-floating btn-tiny req-edit-asset yellow"
							   title="Change quantity"
							   style="vertical-align: middle;"><i
									class="material-icons tiny">edit</i></a>

							<a class="btn-floating btn-tiny req-delete-asset red"
							   title="Delete asset"
							   style="vertical-align: middle;"><i
									class="material-icons tiny">delete</i></a>
							{{/if}}
						{{/if}}
					</div>
			</li>
		{{/each}}
	</ul>
	*/}
{/*
{{#each keyValue addresses}}
<li className="address-item collection-item"
address-id="{{key}}" style="margin-left: 0">

	<div style="margin-bottom: 18px">
		<div
		style="margin-left: 0px;">
			{{key}}
			<span>
			{{#with value}}
				{{#if or vUsd vBtc}}({{#if vBtc}}Ƀ{{readableN4 vBtc}}{{/if}}
				{{#if and vUsd vBtc}}/{{/if}}
				{{#if vUsd}}${{readableN2 vUsd}}{{/if}}){{/if}}
			{{/with}}
			</span>
			<span className="portfolio-badge red white-text">Unverified Address</span>
		</div>

		<div className="hoverie" style="position: absolute; top: 10px; right: 0px;">
			{{#if isOwn}}
				<a className="btn-floating btn-small green per-address req-add-asset-to-address">
				<i className="material-icons small">add</i>
				</a>
				<a className="btn-floating btn-small red per-address req-delete-address btn-margin-right">
				<i className="material-icons small">delete</i>
				</a>
			{{/if}}
		</div>
	</div>
*/}







		              </div>
					</div>
				</Grid>
	}
}

Account.propTypes = {
	// FIXME <Account account={props.account} /> seems stupid? What is should be renamed to?
	// 'data', 'item', 'object', 'asset' ?
	account: PropTypes.object.isRequired,
	//systemId: PropTypes.string.isRequired
}
export default createContainer( props => {
	const 	{ account } = props,
			cfCDs = CF.CurrentData.selectors


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
		  return CurrentData.findOne(cfCDs.system(name)) || {};
		},
		name_of_system() {
			return account.key
		}
	}
}, Account)
