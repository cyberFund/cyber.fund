var logger = log4js.getLogger("assets-tracker");
Meteor.methods({
  cfAssetsUpdateBalance: function (address) {
    var userId = this.userId;

    if (!userId) {
      return;
    }

    // check asset exists
    var asset = Meteor.users.findOne({_id: userId, "assets.address": address}, {fields: {"assets": 1}});
    if (!asset) {
      logger.warn("updateBalance - no such address");
      return;
    }

    var set = {};

    CF.checkBalance(address, Meteor.bindEnvironment(function (err, result) {
        if (!err && result) {
          _.each(result, function (item) {
            if (item.status != 'success') return;
            var q;
            try {
              q = parseFloat(item.quantity)
            } catch (e) {
              q = item.quantity;
            }
            set[item.asset] = {
              quantity: q,
              asset: item.asset,
              updatedAt: new Date(),
              service: item.service,
              address: item.address
            }
          });
          Meteor.users.update({_id: userId, "assets.address": address}, {
            $set: {"assets.$.assets": set}
          });
        }
      })
    );
  },
  "cfAssetsAddAsset": function (account, address) {
    if (!this.userId) return;
    var userId = this.userId;
    //push account to dictionary of accounts, so can use in autocomplete later
    Meteor.users.update({_id: userId}, {
      $push: {
        assets: {account: account, address: address}
      }
    });
    Meteor.call("cfAssetsUpdateBalance", address)
  },

  cfAssetsRemoveAsset: function (asset) {
    var userId = this.userId;
    if (!userId) return;
    Meteor.users.update({_id: userId}, {
      $pull: {
        assets: {account: asset.account, address: asset.address}
      }
    });
  }
});