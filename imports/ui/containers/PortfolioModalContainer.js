import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import helpers from '../helpers'
import { selector } from "../../userFunds/index"
import PortfolioTable from '../components/PortfolioTable'
import get from 'oget'
// TODO do not forget check dependencies

export default PortfolioTableContainer = createContainer(() => {
	// TODO check variables and returned data (clean up)
	// variables
	let ns = CF.Accounts
	ns.currentId = new CF.Utils.SessionVariable("cfAccountsCurrentId")
	const isOwnAssets = helpers.isOwnAssets()
	// data
	function currentAccount() {
	  if (!isOwnAssets()) return null;
	  return CF.Accounts.findById(CF.Accounts.currentId.get());
	}
	function currentAccountId() {
	  if (!isOwnAssets()) return null;
	  return CF.Accounts.currentId.get();
	}
	function currentAddress() {
	  if (!isOwnAssets()) return null;
	  return CF.Accounts.currentAddress.get();
	}
	function currentAsset() {
	  if (!isOwnAssets()) return null;
	  return CF.Accounts.currentAsset.get();
	}
	function currentAmount() {
	  if (!isOwnAssets) return "";
	  var user = Meteor.user();
	  var _id = CF.Accounts.currentId.get();
	  var amount = CF.Accounts.findById(_id);
	  if (!amount) return "";
	  amount = amount.addresses;
	  if (!amount) return "";
	  amount = amount[CF.Accounts.currentAddress.get()];
	  if (!amount) return "";
	  amount = amount.assets;
	  if (!amount) return "";
	  key = CF.Accounts.currentAsset.get();
	  if (key) key = key._id;
	  if (amount) amount = (key ? amount[key] : "");
	  if (!amount) return "";
	  return amount.quantity || "";
	}
	function privacyOpposite(key) {
	  var account = CF.Accounts.findById(key);
	  if (!account) return "";
	  return ns.privateToString(!account.isPrivate);
	}

	return {
		assetsOwnerId: CF.Profile.currentUid()
		},
		_accounts: CF.Accounts.findByRefId(CF.Profile.currentUid()).fetch()
		},
		currentAccount: currentAccount(),
		currentAccountId: currentAccountId(),
		currentAddress: currentAddress(),
		currentAsset: currentAsset(),
		currentAmount: currentAmount(),
		privacyOpposite: privacyOpposite() //key
	}
}, PortfolioTable)
