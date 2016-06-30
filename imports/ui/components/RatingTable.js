import React, { PropTypes }from 'react'
import { Grid, Cell } from 'react-mdl'
import get from 'oget'
import helpers from '../helpers'

/*Template["ratingTable"].events({
    "click .show-more": function(e, t) {
      var step = CF.Rating.step;
      var limit = Session.get("ratingPageLimit");
      limit += step;
      analytics.track("Viewed Crap", {
        counter: (limit - initialLimit) / step
      });
      limit = Math.min(limit, Counts.get("coinsCount"));
      Session.set("ratingPageLimit", limit);
    },
    "click .no-click a": function() {
      return false;
    }
*/

const RatingTable = props => {
    const renderRows = props.systems.map( user => {
        //{{>hitryImage img_url=avatar class="avatar-at-systems" fallback='av'}}
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

    return <table style={{width: '100%'}} className="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp center">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th className="mdl-data-table__cell--non-numeric">System</th>
                  <th>Token</th>
                  <th>Trade</th>
                  <th>CMGR[$]</th>
                  <th>Months</th>
                  <th>Cap in $</th>
                  <th>Price</th>
                  <th>1d Change</th>
                  <th>Stars</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                  {/*renderRows*/}
              </tbody>
            </table>
}

RatingTable.propTypes = {
  systems: PropTypes.array.isRequired
}

export default RatingTable
