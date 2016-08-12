import React, { PropTypes }from 'react'
import { Grid, Cell, DataTable, TableHeader } from 'react-mdl'
import get from 'oget'
import helpers from '../helpers'
import Image from '../components/Image'

// usage example:
// <FundsTable funds={Array} />

const FundsTable = props => {

	// variables
	const 	tableClasses = "mdl-data-table mdl-js-data-table mdl-shadow--2dp center",
			nonNumeric 	 = "mdl-data-table__cell--non-numeric"

    const renderRows = props.funds.map( user => {
                return  <tr key={user._id} itemScope itemType="http://schema.org/Person">
                            <td className={nonNumeric}>
                                <a href={`/@${user.username}`} title={user.profile.name}>
                                    <Image
                                        avatar
                                        src={user.avatar}
                                        style={{marginRight: 15}}
                                    />
                                    <span>@{user.username}</span>
                                </a>
                            </td>
                            <td>
                                {helpers.readableN2(user.publicFunds)}
                            </td>
                            <td>
                                {helpers.readableN0(user.publicFundsUsd)}
                            </td>
                            <td>
                                {get(user, 'profile.followingUsers.length', 0)}
                            </td>
                        </tr>
    })

    return <table className={tableClasses} {...props}>
              <thead>
                    <tr>
                      <th style={{textAlign: 'center'}} className={nonNumeric}>
                          Fund
                      </th>
                      <th>Valuation in Ƀ</th>
                      <th>Valuation in $</th>
                      <th>Followed By</th>
                    </tr>
              </thead>
              <tbody>
                    {renderRows}
              </tbody>
           </table>
}
FundsTable.propTypes = {
  funds: PropTypes.array.isRequired
}
export default FundsTable
