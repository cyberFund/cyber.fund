CF.UserAssets.currentAccount = new CF.Utils.SessionVariable('cfAssetsCurrentAccount');


Template['assetsManager'].rendered = function () {
  this.$renameAccountInput = this.$("#rename-account-in");
  this.$renameAccountErrorLabel = this.$("#account-rename-exists");
  this.$addAssetInput = this.$("#add-asset-input");
  this.$addAssetErrorLabel = this.$("#add-asset-error");
};

Template['assetsManager'].helpers({
  "treasures": function () {
    var user = Meteor.user();
    if (!user) return [];
    return user.assets;
  },
  currentAccount: function(){
    var current = CF.UserAssets.currentAccount.get();
    var user = Meteor.user();
    if (!current || !user || !user.accounts || !user.accounts[current] ) return {};
    return user.accounts[current];
  },
  currentAssetId: function(){
    return CF.UserAssets.currentAsset.get();
  }
});

Template['assetsManager'].onCreated(function () {
  var instance = this;
  instance.subscribe('ownAssets');
});

Template['assetsManager'].events({
  'click .req-update-balance': function (e, t) {
    var $assetrow = t.$(e.currentTarget).closest("tr");
    var address = $assetrow.attr("asset-id");
    Meteor.call("cfAssetsUpdateBalance", address, function (err, ret) {
      Session.set("updatingBalance", null);
    });
  },
  'click .submit-remove-account': function(e, t) {
    console.log(CF.UserAssets.currentAccount.get());
    Meteor.call("cfAssetsRemoveAccount", CF.UserAssets.currentAccount.get());
    $("#modal-remove-account").closeModal();
  },
  'keyup #rename-account-in, change #rename-account-in': function(e, t){
    var accountId = CF.UserAssets.currentAccount.get();
    var user = Meteor.user();
    if (!user || !user.accounts || !accountId || !user.accounts[accountId]) return;
    var oldName = user.accounts[accountId].name;

    var invalidState = t.$renameAccountInput.hasClass("invalid");
    var validName = CF.UserAssets.accNameIsValid(t.$renameAccountInput.val(), oldName);

    if (invalidState && validName) { // => valid
      t.$renameAccountInput.removeClass("invalid");
      t.$renameAccountErrorLabel.addClass("hidden")
    }
    if (!invalidState && !validName) { // => invalid
      t.$renameAccountInput.addClass("invalid");
      t.$renameAccountErrorLabel.removeClass("hidden")
    }
  },
  'click .submit-rename-account': function(e, t){
    var key = CF.UserAssets.currentAccount.get();
    Meteor.call("cfAssetsRenameAccount", CF.UserAssets.currentAccount.get(), t.$renameAccountInput.val());
    $("#modal-rename-account").closeModal();
  },
  'keyup #add-asset-input, change #add-asset-input': function(e, t){
    var address = t.$addAssetInput.val();
    var accounts = Meteor.user.accounts || {};
    var addresses = _.flatten(_.map(accounts, function (account){
      return _.map(account.assets, function(v, k){
        return k;
      })
    }));
    if (addresses.indexOf(address) > -1) {
      t.$addAssetErrorLabel.removeClass("hidden")
    } else {
      t.$addAssetErrorLabel.addClass("hidden")
    }
  },
  'click .submit-add-asset': function (e, t) { //TAG: assets
    var account = CF.UserAssets.currentAccount.get();
    var address = t.$addAssetInput.val();
    console.log(account, address);
    var accounts = Meteor.user.accounts || {};
    var addresses = _.flatten(_.map(accounts, function (account){
      return _.map(account.assets, function(v, k){
        return k;
      })
    }));
    if (addresses.indexOf(address) > -1) {
      return;
    }

    Meteor.call("cfAssetsAddAsset", account, address, function (err, ret) {
      t.$addAssetInput.val("");
      t.$("#modal-add-asset").closeModal();

    })
  },
  'click .submit-remove-asset': function(e, t){
    Meteor.call("cfAssetsRemoveAsset", CF.UserAssets.currentAccount.get(),
    CF.UserAssets.currentAsset.get());
    $("#modal-remove-asset").closeModal();
  },
  'click .per-account': function(e, t){
    var accountKey = t.$(e.currentTarget).closest(".account-item").attr("account-key");
    console.log(accountKey);
    CF.UserAssets.currentAccount.set(accountKey.toString());
    console.log(CF.UserAssets.currentAccount.get());
    console.log(Meteor.user().accounts[CF.UserAssets.currentAccount.get()]);
  }
});