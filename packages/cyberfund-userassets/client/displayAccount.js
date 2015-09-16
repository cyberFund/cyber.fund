CF.UserAssets.currentAddress = new CF.Utils.SessionVariable("cfAssetsCurrentAddress");
CF.UserAssets.currentAsset = new CF.Utils.SessionVariable("cfAssetsCurrentAsset");
var isOwnAssets = function(){
  return CF.Profile.currentTwid.get() == CF.User.twid();
}

Template['displayAccount'].rendered = function () {
  var t = this;

  t.$('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrain_width: false, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on hover
      gutter: 12, // Spacing from edge
      belowOrigin: true // Displays dropdown below the button
    }
  );
};

Template['displayAccount'].helpers({
  'disabledTogglePrivate': function () {
    return 'disabled';
  },
  'publicity': function () {
    return this.isPublic ? 'Public Account' : 'Private Account'
  },
  autoUpdateAvailable: function(address){
    if (!isOwnAssets()) return false;
    var re = new RegExp();
    return (address || '').match(/^[13]/) ? true : false;
  },
  isOwn: function(){
    return isOwnAssets();
  },
  systemData: function(){
    return CurrentData.findOne(CF.CurrentData.selectors.system(this.value.asset)) || {};
  },
  name_of_system: function(){
    return this.value.asset;//}) || {};
    //return sys.system || ''
  }
});

Template['displayAccount'].events({
  'click .req-remove-account': function (e, t) {
    if (!isOwnAssets()) return;
    $("#modal-delete-account").openModal();
    $("button[type=submit]", "#delete-account-form").focus();
  },
  'click .req-rename-account': function (e, t) {
    if (!isOwnAssets()) return;
    $("#modal-rename-account").openModal();
  },
  'click .mock-soon': function (e, t) {
    if (!isOwnAssets()) return;
    Materialize.toast('Private accounts coming soon', 3200);
  },
  "click .act-remove-address": function (e, t) {
    if (!isOwnAssets()) return;
    t.$("#modal-delete-address").openModal();
    $("button[type=submit]", "#delete-address-form").focus();
  },
  'click .submit-remove-address': function (e, t) {
    Meteor.call("cfAssetsRemoveAddress", CF.UserAssets.currentAddress.get(), function (err, ret) {
      if (!err) {
        CF.UserAssets.currentAddress.set(null);
        t.$("#modal-delete-address").closeModal()
      }
    });
    return false;
  },
  'click .req-add-address': function (e, t) {
    $("#modal-add-address").openModal();
  },
  'click .per-address': function(e, t){
    var $asset = $(e.currentTarget).closest(".address-item");
    CF.UserAssets.currentAddress.set($asset.attr("address-id"));
    CF.UserAssets.currentAccount.set($asset.closest(".account-item")
      .attr("account-key"));
  },
  'click .req-delete-address': function(e, t) {
    $('#modal-delete-address').openModal();
    $("button[type=submit]", "#delete-address-form").focus()
  },
  'click .req-add-asset-to-address': function(e, t){
    CF.UserAssets.currentAsset.set(null);
    $('#modal-add-asset').openModal();
  },
  'click .req-update-address': function(e, t){
    Meteor.call("cfAssetUpdateBalance",
      CF.UserAssets.currentAccount.get(),
      CF.UserAssets.currentAddress.get())
  },
  'click .req-delete-asset': function(e, t){
    var $item = t.$(e.currentTarget).closest(".asset-item")
    CF.UserAssets.currentAsset.set(
      CurrentData.findOne(CF.CurrentData.selectors.system( $item.attr("asset-key")),
      {fields: {system: 1, token: 1, aliases: 1, icon: 1}}));
    if (CF.UserAssets.currentAsset.get()) {
      $item = $item.closest(".address-item");
      CF.UserAssets.currentAddress.set($item.attr("address-id"));
      $item = $item.closest(".account-item");
      CF.UserAssets.currentAccount.set($item.attr("account-key"));
      $("#modal-delete-asset").openModal();
      $("button[type=submit]", "#delete-asset-form").focus();
    }
  },

  'click .req-edit-asset': function(e,t){
    var $item = t.$(e.currentTarget).closest(".asset-item");

    CF.UserAssets.currentAsset.set(
      CurrentData.findOne(CF.CurrentData.selectors.system($item.attr("asset-key")),
      {fields: {system: 1, token: 1, aliases: 1, icon: 1}}));
    if (CF.UserAssets.currentAsset.get()) {
      $item = $item.closest(".address-item");
      CF.UserAssets.currentAddress.set($item.attr("address-id"));
      $item = $item.closest(".account-item");
      CF.UserAssets.currentAccount.set($item.attr("account-key"));
      $("#modal-edit-asset").openModal();
    }
  }
});
