Template['addAsset'].rendered = function () {
  
};

Template['addAsset'].helpers({
  '_account': function () {
    var accounts = Meteor.user.accounts;
    if (!accounts) return {};
    if (!accounts[this.account]) {
      console.log(this.account);
      console.log(accounts);
      return {}
    }
    return accounts[this.account];
  }
});

Template['addAsset'].events({
  'click .req-add-asset': function(e, t){
    $("#modal-add-asset").openModal();
  },
  'click .submit-add-asset': function (e, t) { //TAG: assets
    if (Session.get("addingAccount")) return false;
    var $form = t.$(e.currentTarget).closest("form");
    console.log($form);
    var account = $form.find("[name=account]").val();
    var address = $form.find("[name=address]").val();
    Session.set("addingAccount", true);
    Meteor.call("cfAssetsAddAsset", account, address, function (err, ret) {
      Session.set("addingAccount", null);
      t.$("#modal-add-asset").closeModal()
    })
  },
});