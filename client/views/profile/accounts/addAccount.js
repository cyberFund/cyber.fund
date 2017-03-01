import {CurrentData, Extras, Acounts} from '/imports/api/collections'
//todo: move into namespace

CF.Acounts.addressExists = function (address, refId) {
  if (!refId) return false;
  var accounts = CF.Acounts.findByRefId(refId, {private:true});
  var addresses = _.flatten(_.map(accounts.fetch(), function (account) {
    return _.map(account.addresses, function (v, k) {
      return k;
    })
  }));
  return addresses.indexOf(address) > -1
};

function accountsExist(){
  var userId = Meteor.userId();
  return !!userId && !!Acounts.find({refId: userId}).count();
}

Template['addAccount'].onRendered( function () {
  this.$newAccountName = this.$("#account-name");
  this.$failLabelAccount = this.$("#account-name-exists");

  this.$address = this.$("#address-input");
  this.$failLabelAddress = this.$("#address-exists");

  this.$publicCheckbox = this.$("#private-type");
  this.$newAccountCheckbox = this.$("#add-to-new-account");

  this.$selectAccount = this.$("#account-id-select");

  var t = this;
  //t.$selectAccount.material_select();
  this.toggleAccountGroup = function (isNew) {
    if (isNew) {
      t.$("#existing-account-group").addClass("hidden");
      t.$("#new-account-group").removeClass("hidden");
    } else {
      t.$("#existing-account-group").removeClass("hidden");
      t.$("#new-account-group").addClass("hidden");
    }
  };
  this.uiAccountNameExists = function (newName) {
    var c = newName && CF.Acounts.accountNameIsValid(newName, Meteor.userId());
    if (!c) {
      t.$newAccountName.addClass("invalid");
      t.$failLabelAccount.removeClass("hidden");
    } else {
      t.$newAccountName.removeClass("invalid");
      t.$failLabelAccount.addClass("hidden");
    }
  };
  this.uiAddressExists = function (address) {
    var c = CF.Acounts.addressExists(address, Meteor.userId());
    if (c) {
      t.$address.addClass("invalid");
      t.$failLabelAddress.removeClass("hidden");
    } else {
      t.$address.removeClass("invalid");
      t.$failLabelAddress.addClass("hidden");
    }
  };

  Tracker.autorun(function () {
    var user = Meteor.user();
    var _accountsExist = accountsExist();
    if (!_accountsExist) {
      t.$newAccountCheckbox.prop("checked", true).prop("disabled", true);
      t.$newAccountCheckbox.closest("label").removeClass("black-text");
    } else {
      t.$newAccountCheckbox.prop("checked", false).prop("disabled", false);
      t.$newAccountCheckbox.closest("label").addClass("black-text");
    }
  })
});

Template['addAccount'].helpers({
  disabledTogglePrivacy: function () {
// todo: check user has required thing marked.
// not to keep this in profile, as profile intended to be user-modifiable
    var isOwnAssets = Blaze._globalHelpers.isOwnAssets;
    console.log(" disabledTogglePrivacy helper :::   ", isOwnAssets())
    var user = Meteor.user();
    var ret = CF.UserAssets.isPrivateAccountsEnabled(user) && true//CF.User.hasPublicAccess(user)
    return ( ret ? '' : 'disabled')
  },
  privacyState: function (data) {
    console.log("IN A HELPER OF addAccount TEMPLATE NAMED privacyState , and 'this' is ", this)
    console.log("ALSO< DATA IS", data.main)
    var user = Meteor.user();
    var ret = true;//CF.User.hasPublicAccess(user)
    return  (ret ? "" : "checked");
  },
  currentUserAccounts: function(){
    return CF.Acounts.findByRefId(Meteor.userId())
  }
});

Template['addAccount'].events({
  'click .btn-add-account': function (e, t) {
    t.toggleAccountGroup ( !accountsExist() );
    t.$("#modal-add-account").openModal();
  },
  'keyup #account-name, change #account-name': function (e, t) {
    t.uiAccountNameExists(t.$newAccountName.val());
  },
  'keyup #address-input, change #address-input': function (e, t) {
    t.uiAddressExists(t.$address.val());
  },
  'submit #add-account-form': function (e, t) {
    var isNew = t.$newAccountCheckbox.is(':checked');
    var address = t.$address.val().trim();
    if (!address) {
      Materialize.toast("please enter address", 4000);
      return false;
    }
    if (CF.Acounts.addressExists(address, Meteor.userId())) {
      return false;
    }
    var name = '';
    if (isNew) { // add to new account
      name = t.$newAccountName.val();
      if (!name) {
        Materialize.toast("please enter account name or select existing account", 4000);
        return false;
      }
      if (!CF.Acounts.accountNameIsValid(name, Meteor.userId())) {
        return false;
      }
      t.$(e.currentTarget).addClass('submitted');
      var isPublic = !t.$publicCheckbox.is(":checked");
      analytics.track('Created Account', {
        accountName: name
      });
      analytics.track('Added Address', {
        accountName: name,
        address: address
      });
      Meteor.call("cfAssetsAddAccount", {
        isPublic: isPublic,
        name: name,
        address: address
      }, function(err, ret){
        t.$address.val("");
        $("#modal-add-account").closeModal();
        t.$(e.currentTarget).removeClass('submitted');
      });
      return false;
    } else { // add to existing account
      var accountId = t.$selectAccount.val().trim();
      if (!accountId) {
        Materialize.toast("Please select account to add to", 4000);
        return false;
      }
      name = $("option:selected", t.$selectAccount).text();

      analytics.track('Added Address', {
        accountName: name,
        address: address
      });
      Meteor.call("cfAssetsAddAddress", accountId, address, function (err, ret) {
        t.$("#modal-add-account").closeModal();
        t.$newAccountName.val("");
        t.$address.val("");
        return false;
      });
    }
    return false;
  },
  'change #add-to-new-account': function (e, t) {
    var isNew = t.$(e.currentTarget).is(':checked');
    t.toggleAccountGroup(isNew);
  },
  'click .close-account-dialog': function(e, t){
    analytics.track('Closed Account Dialog');
  }
});
