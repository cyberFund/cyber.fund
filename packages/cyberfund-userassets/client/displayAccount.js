CF.UserAssets.currentAddress = new CF.Utils.SessionVariable("cfAssetsCurrentAsset");

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
    return this.isPublic ? 'public' : 'private'
  },
  autoUpdateAvailable: function(address){
    var re = new RegExp();
    return (address || '').match(/^[13]/) ? true : false;
  }
});

Template['displayAccount'].events({
  "click .act-remove-address": function (e, t) {
    t.$("#modal-remove-address").openModal();
  },
  'click .submit-remove-address': function (e, t) {
    Meteor.call("cfAssetsRemoveAddress", CF.UserAssets.currentAddress.get(), function (err, ret) {
      if (!err) {
        CF.UserAssets.currentAddress.set(null);
        t.$("#modal-remove-address").closeModal()
      }
    })
  },

  'click .req-remove-account': function (e, t) {
    $("#modal-remove-account").openModal();
  },
  'click .req-rename-account': function (e, t) {
    $("#modal-rename-account").openModal();
  },
  'click .mock-soon': function (e, t) {
    Materialize.toast('Private accounts coming soon', 3200);
  },
  'click .req-add-address': function (e, t) {
    $("#modal-add-address").openModal();
  },
  'click .per-address': function(e, t){
    var $asset = $(e.currentTarget).closest(".address-item");
    CF.UserAssets.currentAddress.set($asset.attr("address-id"));
    CF.UserAssets.currentAccount.set($asset.closest(".account-item")
      .attr("account-key"));
    console.log(CF.UserAssets.currentAddress.get());
    console.log(CF.UserAssets.currentAccount.get());
  },
  'click .req-remove-address': function(e, t) {
    $('#modal-remove-address').openModal();
  },
  'click .req-update-address': function(e, t){
    Meteor.call("cfAssetUpdateBalance",
      CF.UserAssets.currentAccount.get(),
      CF.UserAssets.currentAddress.get())
  }

});