/**
 *
 * @param accountsData - accounts object
 * @returns {number} assets value in bitcoins
 */

import {findByRefId} from '/imports/api/cf/account/utils'
import {currentUid} from '/imports/api/cf/profile'

Template['portfolioWidget'].helpers({
  subReady: function(){ return CF.subs.Assets && CF.subs.Assets.ready() },
  showAccountsAdvertise: function() {
    var instance = Template.instance();
    if (CF.subs.Assets.ready()) {
        var user = Meteor.users.findOne({
          _id: currentUid()
        });
        if (!user) return false;
        return !(findByRefId(user._id).count())
    } else return false
  },
  isOwnAssets: function(){
    return currentUid() == Meteor.userId();
  }
})
