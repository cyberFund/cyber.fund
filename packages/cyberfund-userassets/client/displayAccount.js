CF.UserAssets.currentAsset = new CF.Utils.SessionVariable("cfAssetsCurrentAsset");

Template['displayAccount'].rendered = function () {
  $('.dropdown-button').dropdown({
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
  'publicity': function(){
    return this.isPublic ? 'public' : 'private'
  }
});

Template['displayAccount'].events({
  "click .act-remove-asset": function (e, t) {
    t.$("#modal-remove-asset").openModal();
  },
  'click .submit-remove-asset': function (e, t) {
    Meteor.call("cfAssetsRemoveAsset", CF.UserAssets.currentAsset.get(), function (err, ret) {
      if (!err) {
        CF.UserAssets.currentAsset.set(null);
        t.$("#modal-remove-asset").closeModal()
      }
    })
  },

  'click .req-remove-account': function(e, t){
    $("#modal-remove-account").openModal();
  },
  'click .req-rename-account': function(e, t){
    $("#modal-rename-account").openModal();
  },
  'click .req-add-asset': function (e, t) {
    t.$("#modal-add-asset").openModal();
  },

  'click .per-account': function(e, t){
    var accountKey = t.$(e.currentTarget).closest(".account-item").data("accountKey");
    CF.UserAssets.currentAccount.set(accountKey);
  }

});