Template['assetsManager'].rendered = function () {
};

Template['assetsManager'].helpers({
  "treasures": function () {
    var user = Meteor.user();
    if (!user) return [];
    return user.assets;
  },
  'currentAsset': function () {
    return Session.get("currentAsset");
  },
  _accounts: function () {
    var user = Meteor.user();
    if (!user || !user.accounts) return [];
    return Blaze._globalHelpers.keyValue(user.accounts);
  }
});

Template['assetsManager'].onCreated(function () {
  var instance = this;
  instance.subscribe('ownAssets');


});

Template['assetsManager'].events({



  'click .act-update-balance': function (e, t) {
    var $assetrow = t.$(e.currentTarget).closest("tr");
    var address = $assetrow.data("address");
    Session.set("updatingBalance", true);
    Meteor.call("cfAssetsUpdateBalance", address, function (err, ret) {
      Session.set("updatingBalance", null);
    });

  }
});