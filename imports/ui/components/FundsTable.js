import React, { PropTypes }from 'react'
import { Grid, Cell, DataTable, TableHeader } from 'react-mdl'
import get from 'oget'
import helpers from '../helpers'

const FundsTable = props => {
    const renderRows = props.funds.map( user => {
        //{{>hitryImage img_url=avatar class="avatar-at-funds" fallback='av'}}
                return  <tr key={user._id} itemscope itemtype="http://schema.org/Person">
                            <td className="mdl-data-table__cell--non-numeric">
                                <a href={`/@${user.username}`} title={user.profile.name}>
                                    {/* TODO fix hitryImage component! */}
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

    return (
            <table className="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp center">
              <thead>
                <tr>
                  <th className="mdl-data-table__cell--non-numeric">Fund</th>
                  <th>Valuation in Ƀ</th>
                  <th>Valuation in $</th>
                  <th>Followed By</th>
                </tr>
              </thead>
              <tbody>
                  {renderRows}
              </tbody>
            </table>
    )

}
FundsTable.propTypes = {
  funds: PropTypes.array.isRequired
}
export default FundsTable
