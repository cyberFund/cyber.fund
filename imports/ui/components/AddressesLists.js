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
	constructor(props) {
		super(props)
		//state
		this.state = {
			openAddDialog: false,
			openDeleteDialog: false
		}
		// bindings
		this.toggleDialog = this.toggleDialog.bind(this)
	}

	toggleDialog(dialogName) {
		console.warn(dialogName)
		const dialog = this.state[dialogName]
		console.warn(dialog)
		this.setState({
			[dialogName]: !this.state[dialogName]
		})
		console.warn(this.state)
	}

	handleDelete() {
		// const 	accountName = CF.Accounts.currentId.get(),
		// 		address = CF.Accounts.currentAddress.get()
		// console.warn(accountName, address)
		// Meteor.call("cfAssetsRemoveAddress",
		// 	accountName, address,
		// 	(err, ret) =>{
		// 	  this.toggleDialog('openDeleteDialog')
		// })
		// analytics.track("Deleted Address", { accountName, address })
	}

	render() {
		const {props, state} = this
		const iconButtonElement = (
				  <IconButton
				    touch={true}
				    tooltip="more"
				    tooltipPosition="bottom-left"
				  >
				    <MoreVertIcon color={grey400} />
				  </IconButton>
				)
		// TODO do not forgert to implement actions
		const rightIconMenu = (
			<IconMenu iconButtonElement={iconButtonElement}>
				<MenuItem
					primaryText="Add Asset"
					onClick={this.toggleDialog.bind(this, 'openAddDialog')}
					leftIcon={<i className='material-icons'>add</i>}
				/>
				<MenuItem
					primaryText="Delete address"
					onClick={this.toggleDialog.bind(this, 'openDeleteDialog')}
					leftIcon={<i className='material-icons'>delete</i>}
				/>
			</IconMenu>
		)

		// FIXME do not forget to add proper comment
		/* addresses are structured as object
			{ addressId (random numbers): {
				addressName(bitcoin)
			} }
		*/

		function renderAddress(object, address) {
			return _.map(object.assets, 	function renderAsset(asset, name) {
					const 	system = props.getSystem(name),
					systemLink = (...children) => {
						return 	<a
									href={`/system/${helpers._toUnderscores(name)}`}
									className='text-center'
								>
									{children}
								</a>
					}
					return	<ListItem
								leftAvatar={
									systemLink(
										<Image src={system} avatar />,
										<br />,
										// helpers.displaySystemName(system)
									)
								}
								rightIconButton={
									helpers.isOwnAssets() ?	rightIconMenu : null
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
					{_.map(props.addresses, renderAddress)}
					<Confirm
						title='Delete address'
						open={state.openDeleteDialog}
						onConfirm={this.handleDelete}						onCancel={this.toggleDialog.bind(this, 'openDeleteDialog')}
					>
						{/*<p>Confirm deletion of {address} address at {account.name} account</p>*/}
					</Confirm>

					{/*<AddAssetDialog
						title='Add asset'
						open={state.openAddDialog}
						inputLabel='Type amount here'
						onConfirm={(text) => console.warn(text)}
						onCancel={this.toggleDialog.bind(this, 'openAddDialog')}
					/>*/}
				</List>
	}
}

AddressesLists.propTypes = {
	// system is fetched through callback to keep component reusable,
	// and to stay away from dozens micro containers
	getSystem: PropTypes.func.isRequired,
    items: PropTypes.object.isRequired,
	title: PropTypes.string
}

export default AddressesLists
