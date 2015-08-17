CF.UserAssets.currentAccount = new CF.Utils.SessionVariable('cfAssetsCurrentAccount');


Template['assetsManager'].rendered = function () {
};

Template['assetsManager'].helpers({
  "treasures": function () {
    var user = Meteor.user();
    if (!user) return [];
    return user.assets;
  },
  _accounts: function () {
    var user = Meteor.user();
    if (!user || !user.accounts) return [];
    return Blaze._globalHelpers.keyValue(user.accounts);
  },
  currentAccount: function(){
    var current = CF.UserAssets.currentAccount.get();
    var user = Meteor.user();
    if (!current || !user || !user.accounts || !user.accounts[current] ) return {};
    return user.accounts[current];
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
  },
  'click .submit-remove-account': function(e, t) {
    console.log(CF.UserAssets.currentAccount.get());
    Meteor.call("cfAssetsRemoveAccount", CF.UserAssets.currentAccount.get());
    $("#modal-remove-account").closeModal();
  }
});