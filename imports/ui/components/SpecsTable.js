import React, { PropTypes } from 'react'
import { _ } from 'meteor/underscore'
import {Grid, Cell} from 'react-mdl'
import helpers from '../helpers'

const SpecsTable = props => {
	const row = (value, key)=> {
		return <tr>
					<td className="mdl-data-table__cell--non-numeric">
						{helpers._specs_(key)}
					</td>
					<td>{helpers.readableNumbers(value)}</td>
				</tr>
	}
    return  <Grid>
				<Cell col={12}>
					<h2>Specification Table</h2>
					<table className="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp center" {...props}>
						<thead>
							<tr>
								<th style={{textAlign: 'center'}} className="mdl-data-table__cell--non-numeric">
								    Property
								</th>
								<th>Value</th>
							</tr>
						</thead>
						<tbody>
							{_.map(
									props.system.specs,
									(value, key)=> row(value, key)
							)}
						</tbody>
					</table>
				</Cell>
	          {/* you can add components after table */}
	          {props.children}
	        </Grid>
}

SpecsTable.propTypes = {
    system: PropTypes.object.isRequired
}

export default SpecsTable
