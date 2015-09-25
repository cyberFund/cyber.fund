//todo: move into namespace

/**
 * specific client-side version to check account name is valid.
 * extracts current user's accounts and calls generic version
 * @param newName - name to check validness
 * @param oldName - to be used if rename is going on
 * @returns {boolean}
 */
CF.UserAssets.accNameIsValid = function (newName, oldName) {
  var user = Meteor.user();
  if (!user) return true;
  var accounts = user.accounts || {};
  return CF.UserAssets.accountNameIsValid(newName, accounts, oldName);
};

CF.UserAssets.uiAddressExists = function (address) {
  var accounts = Meteor.user().accounts || {};
  var addresses = _.flatten(_.map(accounts, function (account) {
    return _.map(account.addresses, function (v, k) {
      return k;
    })
  }));
  return addresses.indexOf(address) > -1
};

Template['addAccount'].rendered = function () {
  this.$newAccountName = this.$("#account-name");
  this.$failLabelAccount = this.$("#account-name-exists");

  this.$address = this.$("#address-input");
  this.$failLabelAddress = this.$("#address-exists");

  this.$publicCheckbox = this.$("#private-type");
  this.$newAccountCheckbox = this.$("#add-to-new-account");

  this.$selectAccount = this.$("#account-id-select");

  var t = this;
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
    var c = newName && CF.UserAssets.accNameIsValid(newName);
    if (!c) {
      t.$newAccountName.addClass("invalid");
      t.$failLabelAccount.removeClass("hidden");
    } else {
      t.$newAccountName.removeClass("invalid");
      t.$failLabelAccount.addClass("hidden");
    }
  };
  this.uiAddressExists = function (address) {
    var c = CF.UserAssets.uiAddressExists(address);
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
    var accountsExist = user && user.accounts && !_.isEmpty(user.accounts);
    if (!accountsExist) {
      t.$newAccountCheckbox.prop("checked", true).prop("disabled", true);
    } else {
      t.$newAccountCheckbox.prop("checked", false).prop("disabled", false);
    }
    t.toggleAccountGroup(!accountsExist);
  })
};

Template['addAccount'].helpers({
  'disabledPrivates': function () {
// todo: check user has required thing marked.
// not to keep this in profile, as profile intended to be user-modifiable
    var user = Meteor.user();
    return CF.UserAssets.isPrivateAccountsEnabled(user) ?
    '' : 'disabled'
  },
  currentUserAccounts: function(){
    var user = Meteor.user();
    if (!user) return {};
    var accountsPrivate = user.accountsPrivate;
    var accounts = user.accounts;
    if (accountsPrivate) {
      _.each(accountsPrivate, function(acc){
        acc.isPrivate = true;
      })
      _.extend(accounts, accountsPrivate);
    }
    return accounts;
  }
});

Template['addAccount'].events({
  'click .btn-add-account': function (e, t) {
    t.$("#modal-add-account").openModal();
    //t.$selectAccount.material_select('destroy');
    t.$selectAccount.material_select();
    t.$("#existing-account-group > span.caret").remove();
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
    if (CF.UserAssets.uiAddressExists(address)) {
      return false;
    }
    var name = '';
    if (isNew) { // add to new account
      name = t.$newAccountName.val();
      if (!name) {
        Materialize.toast("please enter account name or select existing account", 4000);
        return false;
      }
      if (!CF.UserAssets.accNameIsValid(name)) {
        return false;
      }
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
      });
      t.$address.val("");
      $("#modal-add-account").closeModal();
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
        console.log(t.$newAccountName.val());
        console.log(t.$address.val());
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
