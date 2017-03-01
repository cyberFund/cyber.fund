import cfCDs from '/imports/api/currentData/selectors' //CF.CurrentData .selectors;
import {CurrentData} from '/imports/api/collections'
import {username} from '/imports/api/utils/user'
CF.Acounts.currentAddress = new CF.Utils.SessionVariable("cfAccountsCurrentAddress");
CF.Acounts.currentAsset = new CF.Utils.SessionVariable("cfAccountsCurrentAsset");
var isOwnAssets = function(){
  return CF.Profile.currentUsername() == username();
};

Template["displayAccount"].rendered = function () {
  var t = this;

  t.$(".dropdown-button").dropdown({
    inDuration: 300,
    outDuration: 225,
    constrain_width: false, // Does not change width of dropdown to that of the activator
    hover: false, // Activate on hover
    gutter: 12, // Spacing from edge
    belowOrigin: true // Displays dropdown below the button
  }
  );
};

function isPublicAccount(account){
  return !account.isPrivate;
}

Template["displayAccount"].helpers({
  disabledTogglePrivate: function () {
    return "disabled";
  },
  publicity: function (account) {
    var pub = "Public Account";
    var pri = "Private Account";
    return isPublicAccount(account) ? pub : pri;
  },
  isPublic: function (account) {
    return isPublicAccount(account);
  },
  isOwn: function(){
    return isOwnAssets();
  },
  systemData: function(){
    return CurrentData.findOne(cfCDs.system(this.key)) || {};
  },
  name_of_system: function(){
    return this.key;
  },
  noShowAsset: function(asset){
    console.log("NO SHOW ASSET", asset)
    console.log(" NO SHOW ASSET THIS", this)
    return true || !!(this.quantity || this.update == 'auto')
  }
});

Template["displayAccount"].events({
  "click .req-remove-account": function (e, t) {
    if (!isOwnAssets()) return;
    $("#modal-delete-account").openModal();
    $("button[type=submit]", "#delete-account-form").focus();
  },
  "click .req-rename-account": function (e, t) {
    if (!isOwnAssets()) return;
    $("#modal-rename-account").openModal();
  },
  "click .mock-soon": function (e, t) {
    if (!isOwnAssets()) return;
    Materialize.toast("Private accounts coming soon", 3200);
  },
  "click .act-remove-address": function (e, t) {
    if (!isOwnAssets()) return;
    t.$("#modal-delete-address").openModal();
    $("button[type=submit]", "#delete-address-form").focus();
  },
  "click .submit-remove-address": function (e, t) {
    Meteor.call("cfAssetsRemoveAddress", CF.Acounts.currentId.get(),
    CF.Acounts.currentAddress.get(), function (err, ret) {
      if (!err) {
        CF.Acounts.currentAddress.set(null);
        t.$("#modal-delete-address").closeModal();
      }
    });
    return false;
  },
  "click .req-add-address": function (e, t) {
    $("#modal-add-address").openModal();
  },
  "click .per-address": function(e, t){
    var $asset = $(e.currentTarget).closest(".address-item");
    CF.Acounts.currentAddress.set($asset.attr("address-id"));
    CF.Acounts.currentId.set($asset.closest(".account-item")
      .attr("account-id"));
  },
  "click .req-delete-address": function(e, t) {
    $("#modal-delete-address").openModal();
    $("button[type=submit]", "#delete-address-form").focus();
  },
  "click .req-add-asset-to-address": function(e, t){
    CF.Acounts.currentAsset.set(null);
    $("#modal-add-asset").openModal();
  },
  "click .req-update-address": function(e, t){
    Meteor.call("cfAssetUpdateBalance",
      CF.Acounts.currentId.get(),
      CF.Acounts.currentAddress.get());
  },
  "click .req-delete-asset": function(e, t){
    var $item = t.$(e.currentTarget).closest(".asset-item");
    CF.Acounts.currentAsset.set(
      CurrentData.findOne(cfCDs.system( $item.attr("asset-key")),
      {fields: {token: 1, aliases: 1, icon: 1}}));
    if (CF.Acounts.currentAsset.get()) {
      $item = $item.closest(".address-item");
      CF.Acounts.currentAddress.set($item.attr("address-id"));
      $item = $item.closest(".account-item");
      CF.Acounts.currentId.set($item.attr("account-id"));
      $("#modal-delete-asset").openModal();
      $("button[type=submit]", "#delete-asset-form").focus();
    }
  },

  "click .req-edit-asset": function(e,t){
    var $item = t.$(e.currentTarget).closest(".asset-item");

    CF.Acounts.currentAsset.set(
      CurrentData.findOne(cfCDs.system($item.attr("asset-key")),
      {fields: {token: 1, aliases: 1, icon: 1}}));
    if (CF.Acounts.currentAsset.get()) {
      $item = $item.closest(".address-item");
      CF.Acounts.currentAddress.set($item.attr("address-id"));
      $item = $item.closest(".account-item");
      CF.Acounts.currentId.set($item.attr("account-id"));
      $("#modal-edit-asset").openModal();
    }
  },
  "click .req-toggle-private": function(e, t){
    var user = Meteor.user();
    if (!user) return false;
    //if (!CF.User.hasPublicAccess(user)) return false;
    //{{! todo: add check if user is able using this feature}}
    var $item = t.$(e.currentTarget).closest(".account-item");
    CF.Acounts.currentId.set($item.attr("account-id"));
    $("#modal-toggle-private").openModal();
  }
});
