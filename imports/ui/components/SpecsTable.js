import React, { PropTypes } from 'react'
import { _ } from 'meteor/underscore'
import {Grid, Cell} from 'react-mdl'
import helpers from '../helpers'

const SpecsTable = props => {

	// NOTE table is rendered by mapping system.specs object,
	// first row == property key, second == property value
	if (_.isEmpty(props.system.specs)) return null

	const tableClasses = "mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp center"
	const nonNumeric = "mdl-data-table__cell--non-numeric"

	function renderTableRow(value, key) {
		// handle nested objects by reruning function
		if (_.isObject(value)) return _.map(value, renderTableRow)
		return <tr key={key}>
					{/* key */}
					<td className={nonNumeric}>
						{helpers._specs_(key)}
					</td>
					{/* value */}
					<td>{helpers.readableNumbers(value)}</td>
				</tr>
	}

    return  <Grid>
				<Cell col={12}>
					<h3 className="text-center">Specification Table</h3>
					<table className={tableClasses} {...props}>
						<thead>
							<tr>
								<th className={nonNumeric}>
								    Property
								</th>
								<th>Value</th>
							</tr>
						</thead>
						<tbody>
							{_.map(props.system.specs, renderTableRow)}
						</tbody>
					</table>
				</Cell>
	        </Grid>
}

SpecsTable.propTypes = {
    system: PropTypes.object.isRequired
}

export default SpecsTable
