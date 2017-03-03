import Acounts from '/imports/api/collections/Acounts'
import {_k, normalizeOptionsPerUser} from '/imports/api/utils'
import {findByRefId} from '/imports/api/utils/accounts'
import {updateBalances} from '/imports/api/utils/accounts'
import {updateBalanceAccount} from '/imports/api/cf/accounts/utils'

Meteor.methods({
  importAccounts: function(sel) {
    var user = Meteor.user();
    if (!user) return;
    if (!user.hasSuperPowers) sel = {
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
      console.log(user._id);
      cfClientAccountUtils._importFromUser(user._id);
    });
  },

  // autoupdate balances for user
  cfAssetsUpdateBalances: function(options) { //TODO: BUILD CORRECT!
    options = normalizeOptionsPerUser(options);

    // print("cfAssetsUpdateBalances was called with options", options, true);
    options.refId = options.userId || this.userId;
    options.private = options.userId == this.userId;
    if (!options.userId && !options.accountKey) return {
      error: "neither userId nor accountKey passed"
    };
      //this.unblock(); //? not sure this is what needed
    return updateBalances(options);
  },
  checkBalance: function(address) {
    return cfClientAccountUtils.quantumCheck(address.toString());
  },
  // manual set
  cfAssetsAddAsset: function(accountKey, address, asset, q) {
    if (typeof q == "string") try {
      q = parseFloat(q);
    } catch (e) {
      return;
    }
    if (!checkAllowed(accountKey, this.userId)) return;
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
    updateBalanceAccount(Acounts.findOne(sel), {
      private: true
    });
  },
  cfAssetsRemoveAddress: function(accountKey, asset) {
    if (!checkAllowed(accountKey, this.userId)) return;
    if (!asset) return;
    var sel = { _id: accountKey };
    var key = _k(["addresses", asset]);
    var unset = {
      $unset: {}
    };
    unset.$unset[key] = true;
    Acounts.update(sel, unset);
    updateBalanceAccount(Acounts.findOne(sel), {
      private: true
    });
  },

  cfAssetsDeleteAsset: function(accountKey, address, asset) {
    if (!checkAllowed(accountKey, this.userId)) return;
    var sel = {
      _id: accountKey
    };
    var modify = {
      $unset: {}
    };
    var key = _k(["addresses", address, "assets", asset]);
    modify.$unset[key] = true;
    Acounts.update(sel, modify);
    updateBalanceAccount(Acounts.findOne(sel), {
      private: true
    });
  }
});

module.exports = {
  quantumCheck: function (address) {
    function transform(data) {
      _.each(data, function(asset) {
        if (typeof asset.quantity == "string")
          asset.quantity = parseFloat(asset.quantity);
      });
      return data;
    }

    try {
      var r = HTTP.call("GET", "http://quantum.cyber.fund:3001?address=" + address);
      if (r.statusCode == 200) {
      //  print("address", address);
        return transform(r.data);
      } else {
        return ["error", {
          statusCode: r.statusCode
        }];
      }
    } catch (e) {
    //  print("on checking address " + address + " quantum returned code ",
      //  e.response && e.response.statusCode, true);
      return ["error", {
        statusCode: e.response && e.response.statusCode
      }];
    }
  }
}
