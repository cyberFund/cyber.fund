import React, { PropTypes } from 'react'
import { _ } from 'meteor/underscore'
import Image from '../components/Image'
import Confirm from '../components/Confirm'
// import AddAssetDialog from '../components/AddAssetDialog'
import { If } from '../components/Utils'
import helpers from '../helpers'

import {List, ListItem} from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Subheader from 'material-ui/Subheader'
import Avatar from 'material-ui/Avatar'
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import Chip from 'material-ui/Chip'


class AddressesLists extends React.Component {
	state = {
		selectedAddress: null,
		selectedAsset: null,
		openAddDialog: false,
		openDeleteDialog: false
	}

	toggleDialog = (dialogName, selectedAddress, selectedAsset) => {

		this.setState({
			selectedAddress,
			selectedAsset,
			[dialogName]: !this.state[dialogName]
		})

	}

	handleDelete = () => {

		const	{ account } = this.props,
				{ selectedAddress, selectedAsset } = this.state

		Meteor.call("cfAssetsRemoveAddress",
			account._id,
			selectedAddress,
			selectedAsset,
			(err, succes) => {
				// TODO add snackbar
				if(succes) 	analytics.track("Deleted Address", {
								accountName: account._id,
								address: selectedAddress
							})
				else console.error(err)
				this.toggleDialog('openDeleteDialog')
		})

	}

	render() {
		const 	{props, state, toggleDialog} = this

		// OBJECT STRUCTURE
		// {
		// 	props.addresses: {
		// 		addresId: {
		// 			assets: {
		// 				SystemName (ie bitcoin): {data}
		// 			}
		// 		},
		// 		addresId,
		// 		addresId
		// 	}
		// }

		// nested map functions are used because params of first function are used inside second
		// (ie adress variable is used insude assets)
		function renderAddress(object, address) {
			console.warn(object, address);

			return _.map(object.assets, (asset, name) => {
					// TODO do not forgert to implement actions
					const	system = props.getSystem(name),
							rightIconMenu = <IconMenu
													// icon button
													iconButtonElement={
														<IconButton
															touch={true}
															tooltip="options"
															tooltipPosition="bottom-left"
														>
															<MoreVertIcon color={grey400} />
														</IconButton>
													}
													// open menu from top to bottom left
													anchorOrigin={{horizontal: 'right', vertical: 'top'}}
													targetOrigin={{horizontal: 'right', vertical: 'top'}}
											>
												<MenuItem
													primaryText="Add Asset"
													onClick={toggleDialog.bind(this, 'openAddDialog', address, name)}
													leftIcon={<i className='material-icons'>add</i>}
												/>
												<MenuItem
													primaryText="Delete address"
													onClick={toggleDialog.bind(this, 'openDeleteDialog', address, name)}
													leftIcon={<i className='material-icons'>delete</i>}
												/>
											</IconMenu>

					return	<ListItem
								leftAvatar={
									<a
										href={`/system/${helpers._toUnderscores(name)}`}
										className='text-center'
									>
												<Image src={system} avatar />
									</a>
								}
								primaryText={
									<span>{asset.quantity} {helpers.displayCurrencyName(name)}s</span>
								}
								secondaryText={
								<p>
									{` (${helpers.displayBtcUsd(asset.vBtc, asset.vUsd)})`}
									<br />
									{address} {/* <Chip>Unverified Address</Chip> */}
								</p>
								}
								rightIconButton={
									helpers.isOwnAssets() ?	rightIconMenu : null
								}
								secondaryTextLines={4}
								asset-key={name}
								key={name}
								// TODO check if this rendered properly
								address-id={address}
							/>
				})

		}

		return 	<List>
		        	<Subheader className='text-big'>{props.title}</Subheader>
					<Divider inset={false} />

					{/* LIST ITEMS */}
					{_.map(props.account.addresses, renderAddress.bind(this))}

					{/* DIALOGS */}
					<Confirm
						//title='Delete address'
						confirmText='delete'
						open={state.openDeleteDialog}
						onConfirm={this.handleDelete}
						onCancel={toggleDialog.bind(this, 'openDeleteDialog')}
					>
						<b>Confirm deletion of {state.selectedAddress} address at {this.props.account.name} account</b>
					</Confirm>

					{/*<AddAssetDialog
						title='Add asset'
						open={state.openAddDialog}
						inputLabel='Type amount here'
						onConfirm={(text) => console.warn(text)}
						onCancel={toggleDialog.bind(this, 'openAddDialog')}
					/>*/}
				</List>
	}
}

AddressesLists.propTypes = {
	// TODO maybe change <AddressesLists account={} /> to <AddressesLists addresses={} accountId={} /> ?
	// the whole account is being passed becaused account._id is used in meteor calls
	account: PropTypes.object.isRequired,
	// system is fetched through callback to keep component reusable,
	// and to stay away from dozens micro containers
	getSystem: PropTypes.func.isRequired,
	title: PropTypes.string
}

export default AddressesLists
