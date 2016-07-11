import React, { PropTypes } from 'react'
import { _ } from 'meteor/underscore'
//import { Grid, Cell } from 'react-mdl'
import Assets from '../components/Assets'
import { If } from '../components/Utils'
import helpers from '../helpers'

// FIXME should we change this component to "Assets?" Or "AddressList"?
const Addresses = props => {

	const tableClasses = "mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp center"
	const nonNumeric = "mdl-data-table__cell--non-numeric"

	function renderAddress(value, key) {
		// handle nested objects by reruning function
		//if (_.isObject(value)) return _.map(value, renderTableRow)
		// return <tr key={key}>
		// 			{/* key */}
		// 			<td className={nonNumeric}>
		// 				{helpers._specs_(key)}
		// 			</td>
		// 			{/* value */}
		// 			<td>{helpers.readableNumbers(value)}</td>
		// 		</tr>
		return 	<li
					className="address-item collection-item"
					address-id={key} // TODO check if this rendered properly
					style="margin-left: 0"
				>
					<div style={{marginBottom: 18}}>
						<div style={{marginLeft: 0}}>
							{key}
							<span>
								<If condition={value.vUsd || value.vBtc}>
									(<If condition={value.vBtc}>
										Ƀ{readableN4(value.vBtc)}
										<If condition={value.vUsd && value.vBtc}>/</If>
										<If condition={value.vBtc}>
											${readableN2(value.vUsd)}
										</If>)
									</If>
								</If>
						    </span>
						   <span className="portfolio-badge red white-text">Unverified Address</span>
						</div>

						<div className="hoverie" style={{position: 'absolute', top: 10, right: 0}}>
							<If condition={isOwn()}>
								<a className="btn-floating btn-small green per-address req-add-asset-to-address">
									<i className="material-icons small">add</i>
								</a>
								<a className="btn-floating btn-small red per-address req-delete-address btn-margin-right">
									<i className="material-icons small">delete</i>
								</a>
							</If>
						</div>

						<Assets assets={value.assets} />
					</div>
				</li>
	}

    return  <ul>
				{_.map(props.addresses, renderAddress)}
			</ul>
}

Addresses.propTypes = {
    addresses: PropTypes.object.isRequired
}

export default Addresses
