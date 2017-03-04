/**
 *
 * @param accountsData - accounts object
 * @returns {number} assets value in bitcoins
 */

import {findByRefId} from '/imports/api/cf/accounts/utils'
import {isOwnAssets} from '/imports/api/client/utils/profile'
import {currentUid} from '/imports/api/cf/profile'
import {Meteor} from 'meteor/meteor'

Template['portfolioWidget'].helpers({
  showAccountsAdvertise: function() {
    var instance = Template.instance()
    if (instance.subscriptionsReady()) {
        var user = Meteor.users.findOne({
          _id: currentUid()
        });
        if (!user) return false;
        return !(findByRefId(user._id).count())
    } else return false
  },
  isOwnAssets: isOwnAssets
})
