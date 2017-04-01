import cfCDs from '/imports/api/currentData/selectors'
import {CurrentData} from '/imports/api/collections'
import {cfCurrentAsset, cfCurrentAddress, cfCurrentId} from '/imports/api/client/utils'
import {username} from '/imports/api/utils/user'
import {currentUsername} from '/imports/api/cf/profile'
import {Meteor} from 'meteor/meteor'

var isOwnAssets = function(){
  return currentUsername() == username();
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
    Meteor.call("cfAssetsRemoveAddress", cfCurrentId.get(),
    cfCurrentAddress.get(), function (err, ret) {
      if (!err) {
        cfCurrentAddress.set(null);
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
    cfCurrentAddress.set($asset.attr("address-id"));
    cfCurrentId.set($asset.closest(".account-item")
      .attr("account-id"));
  },
  "click .req-delete-address": function(e, t) {
    $("#modal-delete-address").openModal();
    $("button[type=submit]", "#delete-address-form").focus();
  },
  "click .req-add-asset-to-address": function(e, t){
    cfCurrentAsset.set(null);
    $("#modal-add-asset").openModal();
  },
  "click .req-update-address": function(e, t){
    Meteor.call("cfAssetUpdateBalance",
      cfCurrentId.get(),
      cfCurrentAddress.get());
  },
  "click .req-delete-asset": function(e, t){
    var $item = t.$(e.currentTarget).closest(".asset-item");
    cfCurrentAsset.set(
      CurrentData.findOne(cfCDs.system( $item.attr("asset-key")),
      {fields: {token: 1, aliases: 1, icon: 1}}));
    if (cfCurrentAsset.get()) {
      $item = $item.closest(".address-item");
      cfCurrentAddress.set($item.attr("address-id"));
      $item = $item.closest(".account-item");
      cfCurrentId.set($item.attr("account-id"));
      $("#modal-delete-asset").openModal();
      $("button[type=submit]", "#delete-asset-form").focus();
    }
  },

  "click .req-edit-asset": function(e,t){
    var $item = t.$(e.currentTarget).closest(".asset-item");

    cfCurrentAsset.set(
      CurrentData.findOne(cfCDs.system($item.attr("asset-key")),
      {fields: {token: 1, aliases: 1, icon: 1}}));
    if (cfCurrentAsset.get()) {
      $item = $item.closest(".address-item");
      cfCurrentAddress.set($item.attr("address-id"));
      $item = $item.closest(".account-item");
      cfCurrentId.set($item.attr("account-id"));
      $("#modal-edit-asset").openModal();
    }
  },
  "click .req-toggle-private": function(e, t){
    var user = Meteor.user();
    if (!user) return false;

    var $item = t.$(e.currentTarget).closest(".account-item");
    cfCurrentId.set($item.attr("account-id"));
    $("#modal-toggle-private").openModal();
  }
});
