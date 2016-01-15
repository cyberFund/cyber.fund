CF.UserAssets.currentAddress = new CF.Utils.SessionVariable("cfAssetsCurrentAddress");
CF.UserAssets.currentAsset = new CF.Utils.SessionVariable("cfAssetsCurrentAsset");
var isOwnAssets = function(){
  return CF.Profile.currentTwid.get() == CF.User.twid();
};

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

function isPublicAccount(account){
  var user = Meteor.user();
  if (!account || !account.key || !user) return true;
  return (_.keys(user.accounts || {}).indexOf(account.key) == -1)
    && !!user.accountsPrivate &&
    (_.keys(user.accountsPrivate || {}).indexOf(account.key) > -1);
}

Template['displayAccount'].helpers({
  'disabledTogglePrivate': function () {
    return 'disabled';
  },
  'publicity': function (account) {
    var pub = 'Public Account';
    var pri = 'Private Account';
    return isPublicAccount(account) ? pri : pub;
  },
  'isPublic': function (account) {
    return isPublicAccount(account);
  },
  autoUpdateAvailable: function(address){
    //if (!isOwnAssets()) return false;
    return true;// for all.
    //var re = new RegExp();
    //return (address || '').match(/^[13]/) ? true : false;
  },
  isOwn: function(){
    return isOwnAssets();
  },
  systemData: function(){
    return CurrentData.findOne(CF.CurrentData.selectors.system(this.value.asset)) || {};
  },
  name_of_system: function(){
    return this.value.asset;
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
    CF.UserAssets.currentAccountKey.set($asset.closest(".account-item")
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
      CF.UserAssets.currentAccountKey.get(),
      CF.UserAssets.currentAddress.get())
  },
  'click .req-delete-asset': function(e, t){
    var $item = t.$(e.currentTarget).closest(".asset-item");
    CF.UserAssets.currentAsset.set(
      CurrentData.findOne(CF.CurrentData.selectors.system( $item.attr("asset-key")),
      {fields: {token: 1, aliases: 1, icon: 1}}));
    if (CF.UserAssets.currentAsset.get()) {
      $item = $item.closest(".address-item");
      CF.UserAssets.currentAddress.set($item.attr("address-id"));
      $item = $item.closest(".account-item");
      CF.UserAssets.currentAccountKey.set($item.attr("account-key"));
      $("#modal-delete-asset").openModal();
      $("button[type=submit]", "#delete-asset-form").focus();
    }
  },

  'click .req-edit-asset': function(e,t){
    var $item = t.$(e.currentTarget).closest(".asset-item");

    CF.UserAssets.currentAsset.set(
      CurrentData.findOne(CF.CurrentData.selectors.system($item.attr("asset-key")),
      {fields: {token: 1, aliases: 1, icon: 1}}));
    if (CF.UserAssets.currentAsset.get()) {
      $item = $item.closest(".address-item");
      CF.UserAssets.currentAddress.set($item.attr("address-id"));
      $item = $item.closest(".account-item");
      CF.UserAssets.currentAccountKey.set($item.attr("account-key"));
      $("#modal-edit-asset").openModal();
    }
  },
  'click .req-toggle-private': function(e, t){
    //{{! todo: add check if user is able using this feature}}
    var $item = t.$(e.currentTarget).closest(".account-item");
    console.log($item);
    console.log($item.attr("account-key"));
      CF.UserAssets.currentAccountKey.set($item.attr("account-key"));
    $("#modal-toggle-private").openModal();
  }
});
