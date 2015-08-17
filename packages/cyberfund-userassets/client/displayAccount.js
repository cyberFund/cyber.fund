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
    Meteor.call("cfAssetsRemoveAsset", Session.get("currentAsset"), function (err, ret) {
      if (!err) {
        Session.set("currentAsset", null);
        t.$("#modal-remove-asset").closeModal()
      }
    })
  },

  "click .act-asset": function (e, t) {
    var $assetrow = t.$(e.currentTarget).closest("tr");
    console.log($assetrow);
    Session.set("currentAsset", {
      account: $assetrow.data("account"),
      address: $assetrow.data("address")
    });
  },
  'click .btn-add-asset': function (e, t) {
    t.$("#modal-add-asset").openModal();
  },

});