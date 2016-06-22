import React, { PropTypes }from 'react'
import { Grid, Cell, DataTable, TableHeader } from 'react-mdl'
import get from 'oget'
import helpers from '../helpers'
import Image from '../components/Image'

const FundsTable = props => {
    const renderRows = props.funds.map( user => {
                return  <tr key={user._id} itemscope itemtype="http://schema.org/Person">
                            <td className="mdl-data-table__cell--non-numeric">
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

    const tableStyle = {width: 545}
    const tableClasses = "mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp center"

    return <table style={tableStyle} className={tableClasses} {...props}>
              <thead>
                    <tr>
                      <th style={{textAlign: 'center'}} className="mdl-data-table__cell--non-numeric">
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
