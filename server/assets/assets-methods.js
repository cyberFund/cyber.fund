Meteor.methods({
  "cfAssetsAddAsset": function (account, address) {
    if (!this.userId) return;
    var userId = this.userId;
    console.log("here");
    //push account to dictionary of accounts, so can use in autocomplete later
    Meteor.users.update({_id: userId}, {
      $push: {
        assets: {account: account, address: address}
      }
    });

    var set = {};

    CF.checkBalance(address, Meteor.bindEnvironment(function (err, result) {
        console.log(err);
        console.log(result);
        if (!err && result) {
          _.each(result, function (item) {
            if (item.status != 'success') return;
            set[item.asset] = {
              quantity: item.quantity,
              asset: item.asset,
              updatedAt: new Date(),
              service: item.service,
              address: item.address
            }
          });
          console.log(set);
          Meteor.users.update({_id: userId, "assets.address": address}, {
            $set: {"assets.$.assets": set}
          });
        }
      })
    );
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
})
;
