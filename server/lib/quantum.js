import {Meteor} from 'meteor/meteor'
import quantumCheck from '/imports/api/cf/accounts/quantumCheck'
import {findByUsername} from '/imports/api/utils/user'
import {updateBalances, importFromUser, updateBalanceAccount} from '/imports/api/utils/accounts'
import {checkAllowed} from '/imports/api/cf/accounts/utils'
import Acounts from '/imports/api/collections/Acounts'
import {_k, normalizeOptionsPerUser} from '/imports/api/utils'

Meteor.methods({
  importAccounts: function(sel) {
    if (Meteor.isSimulation)
      return;
    console.log("in importAccounts")
    var user = Meteor.user();
    if (!user)
      return;
    if (!user.hasSuperPowers)
      sel = {
        _id: this.userId
      };
    return;
    Meteor.users.find(sel || {
      _id: "ErwxCME6azQS7KcNm"
    }, {
      fields: {
        _id: 1
      }
    }).forEach(function(user) {
      importFromUser(user._id);
    });
  },

  // autoupdate balances for user
  cfAssetsUpdateBalances: function(options) { //TODO: BUILD CORRECT!

    if (Meteor.isSimulation)
      return;
    options = normalizeOptionsPerUser(options);
    options.refId = options.userId || this.userId;
    options.private = options.userId == this.userId;
    if (!options.userId && !options.accountKey)
      return {error: "neither userId nor accountKey passed"};
    return updateBalances(options);
  },

  checkBalance: function(address) {
    if (Meteor.isSimulation) return;
    return quantumCheck(address.toString());
  },

  // manual set
  cfAssetsAddAsset: function(accountKey, address, asset, q) {
    if (Meteor.isSimulation)
      return;
    if (typeof q == "string")
      try {
        q = parseFloat(q);
      } catch (e) {
        return;
      }
    if (!checkAllowed(accountKey, this.userId))
      return;
    var sel = {
      _id: accountKey
    };
    var modify = {
      $set: {}
    };
    var key = _k(["addresses", address, "assets", asset]);

    modify.$set[key] = {
      quantity: q,
      update: "manual",
      updatedAt: new Date()
    };

    Acounts.update(sel, modify);
    updateBalanceAccount(Acounts.findOne(sel), {private: true})
  },

  cfAssetsRemoveAddress: function(accountKey, asset) {
    if (Meteor.isSimulation)
      return;
    if (!checkAllowed(accountKey, this.userId))
      return;
    if (!asset)
      return;
    var sel = {
      _id: accountKey
    };
    var key = _k(["addresses", asset]);
    var unset = {
      $unset: {}
    };
    unset.$unset[key] = true;
    Acounts.update(sel, unset);
    updateBalanceAccount(Acounts.findOne(sel), {private: true});
  },

  cfAssetsDeleteAsset: function(accountKey, address, asset) {
    if (Meteor.isSimulation)
      return;
    if (!checkAllowed(accountKey, this.userId))
      return;
    var sel = {
      _id: accountKey
    };
    var modify = {
      $unset: {}
    };
    var key = _k(["addresses", address, "assets", asset]);
    modify.$unset[key] = true;
    Acounts.update(sel, modify);
    updateBalanceAccount(Acounts.findOne(sel), {private: true});
  }
});
