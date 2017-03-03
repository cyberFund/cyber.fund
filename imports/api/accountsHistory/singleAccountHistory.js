import {AcountsHistory} from '/imports/api/collections'
import Acounts from '/imports/api/collections/Acounts'
import {_updateBalanceAccount} from '/imports/api/cf/accounts/utils'
if (Meteor.isServer) {
  exports.putPoint = function(accountIn){
    var accountState = Acounts.findOne({_id: _updateBalanceAccount(accountIn, {private:true}) });
    if (!accountState) return null;
    const accountId = accountState._id;
    delete accountState._id;
    // ? delete accountState.updatedAt

    _.extend(accountState, {accountId: accountId, timestamp: new Date()});
    var ret = {_id: AcountsHistory.insert(accountState),
      state: accountState
    }
    return ret;
  }
}
