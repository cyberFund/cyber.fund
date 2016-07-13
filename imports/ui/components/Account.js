import React, { PropTypes } from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Grid, Cell, Icon, Button, Tabs, Tab } from 'react-mdl'
import { _ } from 'meteor/underscore'
import { If } from '../components/Utils'
import ChaingearLink from '../components/ChaingearLink'
import helpers from '../helpers'

class Account extends React.Component {
	/*constructor(params) {
		super(params)
		this.state = {
			//activeTab: 0,
			// display tabs if there are alot of links
			//displayTabs: this.props.links.length > 8
		}
	}*/
	render() {
		const 	{ props, props: { account, isOwn, publicity } } = this,
				//{ activeTab, displayTabs } = this.state,
				{ readableN2, readableN4 } = helpers

				// DO NOT FORGET CHANGE GRID TO CARD
		return  <Grid className="text-center">
			<div className="card ">
		          <div className="account-item row" account-id={account._id}>
		              <div className="row no-bottom-margin">
		                  <div className="right hoverie" style={{marginRight: 10}}>
		                      <a className="req-update-balance per-account btn-floating btn-tiny blue btn-margin-left">
		                          <i
									  className="material-icons small"
									  title={`last updated at: ${account.updatedAt ? helpers. dateFormat(account.updatedAt) : 'never'}`}>
									  loop
								  </i>
		                      </a>
							  <If condition={props.isOwn}>
		                          <a className="req-rename-account per-account btn-floating btn-tiny yellow"><i
		                                  className="material-icons tiny">edit</i></a>
									  <a className="red-text req-remove-account per-account btn-floating btn-tiny red"><i
		                                  className="material-icons tiny">delete</i></a>
								<If condition={props.userHasPublicAccess}>
		                          <a className="req-toggle-private per-account grey btn-floating btn-tiny">{/*todo: add check if user is able using this feature*/}
		                              <i className="material-icons tiny">
										  { props.isPublic ? 'vpn_lock' : 'public' }
									  </i>
								  </a>
								</If>
							  </If>
							</div>
							<h4 style={{marginLeft: 20}}>
								{account.name}
								<span className="text-big">
									<If condition={account.vUsd || account.vBtc}>
										(<If condition={account.vBtc}>
											Ƀ{readableN4(account.vBtc)}
											<If condition={account.vUsd && account.vBtc}>/</If>
											<If condition={account.vBtc}>
												${readableN2(account.vUsd)}
											</If>)
										</If>
										)
									</If>
								</span>
								<If condition={isOwn()}>
									<span className="portfolio-badge-large green white-text">
										{publicity(account)}
									</span>
								</If>
		                	</h4>
						</div>
						{/*
							<!-- add adress button div style="position: absolute; top: 0; right: 0px">
						                  <a class="btn right per-account req-add-address btn-margin-right">Add address</a>
						              </div  -->
									  */}

		              </div>
					  </div>
				</Grid>
	}
}

Account.propTypes = {
	account: PropTypes.object.isRequired,
	//systemId: PropTypes.string.isRequired
}
export default createContainer( props => {
	const 	{ account } = props,
			cfCDs = CF.CurrentData.selectors


	CF.Accounts.currentAddress = new CF.Utils.SessionVariable("cfAccountsCurrentAddress")
	CF.Accounts.currentAsset = new CF.Utils.SessionVariable("cfAccountsCurrentAsset")

	function isOwnAssets() {
	  return CF.Profile.currentUsername() == CF.User.username();
	}
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
		isOwn() {
		  return isOwnAssets();
		},
		systemData() {
		  return CurrentData.findOne(cfCDs.system(account.key)) || {};
		},
		name_of_system() {
			return account.key
		}
	}
}, Account)
