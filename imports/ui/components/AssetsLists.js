import React, { PropTypes } from 'react'
import { _ } from 'meteor/underscore'
//import { Grid, Cell } from 'react-mdl'
import { If } from '../components/Utils'
import helpers from '../helpers'

const AssetsList = props => {

	function renderAsset(value, key) {
		// return 	<li className="collection-item asset-item" asset-key={key}>
		// 			{/* TODO check if systemlink renders properly */}
		// 			<a href={`/system/${helpers._toUnderscores (value.name_of_system)}`>
		// 			  {{> cgSystemLogo system=systemData className="logo-portfolio"}}
		// 			{{displaySystemName systemData}}</a>
		// 			: {{value.quantity}} {{displayCurrencyName key}}s
		// 			{{#with value}}
		// 			{{#if or vUsd vBtc}}({{#if vBtc}}Ƀ{{readableN4 vBtc}}{{/if}}
		// 			  {{#if and vUsd vBtc}}/{{/if}}
		// 			  {{#if vUsd}}${{readableN2 vUsd}}{{/if}}){{/if}}{{/with}}
		// 				<div className="secondary-content hoverie"
		// 					 style="margin-right: 12px;">
		//
		// 					{{#if eq value.update 'auto'}}
		// 						<span className="portfolio-badge amber white-text">
		// 					Autoupdate</span>
		// 					{{/if}}
		//
		// 					{{#if eq value.update 'manual'}}
		// 						<span className="portfolio-badge green white-text">
		// 					Manually entered</span>
		// 					{{/if}}
		// 					{{#if isOwn}}
		// 						{{#if eq value.update 'manual'}}
		// 						<a className="btn-floating btn-tiny req-edit-asset yellow"
		// 						   title="Change quantity"
		// 						   style="vertical-align: middle;"><i
		// 								className="material-icons tiny">edit</i></a>
		//
		// 							<a className="btn-floating btn-tiny req-delete-asset red"
		// 						   title="Delete asset"
		// 						   style="vertical-align: middle;"><i
		// 								className="material-icons tiny">delete</i></a>
		// 						{{/if}}
		// 					{{/if}}
		// 				</div>
		// 		</li>
	}

    return  <ul className="collection assets-list">
				{_.map(props.assets, renderAsset)}
			</ul>
}

AssetsList.propTypes = {
    assets: PropTypes.object.isRequired
}

export default AssetsList
