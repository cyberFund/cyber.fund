

if (Meteor.isServer) {
  exports.putPoint = function(accountIn){
    var accountState = CF.Accounts.collection.findOne({_id: CF.Accounts._updateBalanceAccount(accountIn, {private:true}) });
    if (!accountState) return null;
    const accountId = accountState._id;
    delete accountState._id;
    // ? delete accountState.updatedAt

    _.extend(accountState, {accountId: accountId, timestamp: new Date()});
    var ret = {_id: CF.Accounts.History.collection.insert(accountState),
      state: accountState
    }
    return ret;
  }
}
