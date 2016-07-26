import React, { PropTypes } from 'react'
import { Meteor } from 'meteor/meteor'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import Search from '../components/Search'

// NOTE i have no idea why this is independent component and not part of AddressesLists
// guess i was confused that day and brain didn't give me better solution

class AddAssetDialog extends React.Component {

	state = {
		dialogIsOpen: false,
		amount: '',
		coinType: ''
	}

	toggleDialog = () => {
		this.setState({ dialogIsOpen: this.state.dialogIsOpen })
	}

	handleInputChange = event => {
		const amount = event.target.value
		console.warn(amount)
		this.setState({ amount })
	}

	handleCoinSelect = system => {
		// var address = t.$addAssetInput.val().trim();
		// var accounts = Meteor.user.accounts || {};
		// var addresses = _.flatten(_.map(accounts, function(account) {
		//   return _.map(account.addresses, function(v, k) {
		// 	return k;
		//   });
		// }));
		// if (addresses.indexOf(address) > -1) {
		//   t.$addAssetErrorLabel.removeClass("hidden");
		// } else {
		//   t.$addAssetErrorLabel.addClass("hidden");
		// }
	}

	handleSubmit = () => {
		// const { props: {account}, state: {amount} } = this
		// if (CF.Accounts.addressExists(address, Meteor.userId())) return false;
		// Meteor.call("cfAssetsAddAddress", account._id, address, function(err, ret) {
		//   t.$addAssetInput.val("");
		//   t.$("#modal-add-address").closeModal();
		// });
		// analytics.track("Added Address", {
		// 	accountName: account._id,
		// 	address: address
		// });
	}

	// TODO do not forget to add explanation
	componentWillReceiveProps(nextProps) {
		this.setState({ dialogIsOpen: nextProps.open})
	}

	render() {
		const 	{props, state} = this,
				dialogButtons = [
							<FlatButton
								label='cancel'
								onTouchTap={this.toggleDialog}
								primary={true}
							/>,
							<FlatButton
								label='add'
								onTouchTap={this.handleSubmit}
								primary={true}
							/>
						]

		//
		// if(this.props.open) this.setState({ dialogIsOpen: true })

		return 	<Dialog
					title='Add asset'
					open={state.dialogIsOpen}
					actions={dialogButtons}
					modal={false}
					onRequestClose={this.toggleDialog}
		        >
					<Search callback={this.handleCoinSelect} />
					<span className="text-large">{state.coinType}</span>
					<TextField
						hintText='Type amount here'
						value={state.amount}
						onChange={this.handleInputChange}
						autoFocus
						fullWidth
						type='number'
					/>
		        </Dialog>
	}
}

AddAssetDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	title: PropTypes.object.isRequired
}

export default AddAssetDialog
