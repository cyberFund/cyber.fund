CF.UserAssets.currentAccountKey = new CF.Utils.SessionVariable('cfAssetsCurrentAccount');
var isOwnAssets = function() {
  return CF.Profile.currentUid() == Meteor.userId();
};

Template['assetsManager'].rendered = function() {
  this.$renameAccountInput = this.$("#rename-account-in");
  this.$renameAccountErrorLabel = this.$("#account-rename-exists");
  this.$addAssetInput = this.$("#add-address-input");
  this.$addAssetErrorLabel = this.$("#add-address-error");
};

Template['assetsManager'].helpers({
  isOwnAssets: function() {
    return isOwnAssets()
  },

  _accounts: function() {
    var user = Meteor.users.findOne({
      _id: CF.Profile.currentUid()
    }) || {};
    var accounts = user.accounts || {};
    if (user._id == Meteor.userId()) {
      _.extend(accounts, user.accountsPrivate || {});
    }
    return accounts;
  },
  currentAccount: function() {
    if (!isOwnAssets()) return null;
    var current = CF.UserAssets.currentAccountKey.get();
    var key0 = CF.UserAssets.getAccountPrivacyType(Meteor.userId(), current);
    if (!key0) return {};
    var user = Meteor.user();
    return user[key0][current];
  },
  currentAccountKey: function() {
    if (!isOwnAssets()) return null;
    return CF.UserAssets.currentAccountKey.get();
  },
  currentAddress: function() {
    if (!isOwnAssets()) return null;
    return CF.UserAssets.currentAddress.get();
  },
  currentAsset: function() {
    if (!isOwnAssets()) return null;
    return CF.UserAssets.currentAsset.get();
  },
  currentAmount: function() {
    if (!isOwnAssets) return '';
    var user = Meteor.user();

    var key = CF.UserAssets.currentAccountKey.get();

    var key0 = CF.UserAssets.getAccountPrivacyType(Meteor.userId(), key);
    if (!key0) return '';
    var amount = user[key0];
    if (!amount) return '';

    if (!key) return '';
    amount = amount[key];
    if (!amount) return '';
    amount = amount.addresses;
    if (!amount) return '';
    amount = amount[CF.UserAssets.currentAddress.get()];
    if (!amount) return '';
    amount = amount.assets;
    if (!amount) return '';
    key = CF.UserAssets.currentAsset.get();
    if (key) key = key._id;
    if (amount) amount = (key ? amount[key] : '');
    if (!amount) return '';
    return amount.quantity || '';
  },
  showAccountsAdvertise: function() {
    if (CF.Profile.currentTwid.get() == CF.User.twid()) {
      var user = Meteor.users.findOne({
        _id: CF.Profile.currentUid()
      });
      return !((user.accounts && _.keys(user.accounts).length) || (user.accountsPrivate && _.keys(user.accountsPrivate).length))
    }
    return false;
  },
  privacyOpposite: function(key) {
    var key0 = CF.UserAssets.getAccountPrivacyType(Meteor.userId(), key);
    if (!key0) return '';
    if (key0 == 'accounts') return 'private';
    return 'public';
  }
});

Template['assetsManager'].onCreated(function() {
  var instance = this;

  //if own profile, else getting data from user' "profile.assets" -
  // this all going to be actual once we get to private accounts
  instance.subscribe('profileAssets', CF.Profile.currentTwid.get());
  Tracker.autorun(function() {
    var user = Meteor.users.findOneByTwid(CF.Profile.currentTwid.get());

    var systems = user && user.accounts;
    if (CF.Profile.currentUid == Meteor.userId()) {
      _.extend(systems, user.accountsPrivate);
    }
    systems = CF.UserAssets.getSystemsFromAccountsObject(systems);
    Meteor.subscribe('assetsSystems', systems);
  });
});

Template['assetsManager'].events({
  'click .req-update-balance': function(e, t) { //todo: add checker per account/ per user
    if (!isOwnAssets()) return;

    var $t = t.$(e.currentTarget);
    $t.addClass("disabled");
    Meteor.call("cfAssetsUpdateBalances", {
      accountKey: CF.UserAssets.currentAccountKey.get(),
      address: CF.UserAssets.currentAddress.get()
    }, function(er, re) {
      $t.removeClass("disabled");
    });
  },

  'click .req-update-balance-account': {
    function(e, t) { //todo: add checker per account/ per user
      if (!isOwnAssets()) return;

      var $t = t.$(e.currentTarget);
      $t.addClass("disabled");
      Meteor.call("cfAssetsUpdateBalances", {
        accountKey: CF.UserAssets.currentAccountKey.get(),
        //  address: CF.UserAssets.currentAddress.get()
      }, function(er, re) {
        $t.removeClass("disabled");
      });
    }
  },
  

  'submit #delete-account-form': function(e, t) {
    if (!isOwnAssets()) return false;
    analytics.track('Deleted Account', {
      accountName: CF.UserAssets.currentAccountKey.get()
    });
    Meteor.call("cfAssetsRemoveAccount", CF.UserAssets.currentAccountKey.get());
    $("#modal-delete-account").closeModal();
    return false;
  },
  'keyup #rename-account-in, change #rename-account-in': function(e, t) {
    if (!isOwnAssets()) return;
    var accountId = CF.UserAssets.currentAccountKey.get();
    var user = Meteor.user();
    if (!user || !user.accounts || !accountId || !user.accounts[accountId]) return;
    var oldName = user.accounts[accountId].name;

    var invalidState = t.$renameAccountInput.hasClass("invalid");
    var validName = CF.UserAssets.accNameIsValid(t.$renameAccountInput.val().trim(), oldName);

    if (invalidState && validName) { // => valid
      t.$renameAccountInput.removeClass("invalid");
      t.$renameAccountErrorLabel.addClass("hidden")
    }
    if (!invalidState && !validName) { // => invalid
      t.$renameAccountInput.addClass("invalid");
      t.$renameAccountErrorLabel.removeClass("hidden")
    }
  },
  'submit #rename-account-form': function(e, t) {
    if (!isOwnAssets()) return false;
    //var key = CF.UserAssets.currentAccountKey.get();
    analytics.track('Renamed Account', {
      oldName: CF.UserAssets.currentAccountKey.get(),
      newName: t.$renameAccountInput.val()
    });
    Meteor.call("cfAssetsRenameAccount", CF.UserAssets.currentAccountKey.get(), t.$renameAccountInput.val());
    $("#modal-rename-account").closeModal();
    return false;
  },
  'keyup #add-address-input, change #add-address-input': function(e, t) {
    if (!isOwnAssets()) return;
    var address = t.$addAssetInput.val().trim();
    var accounts = Meteor.user.accounts || {};
    var addresses = _.flatten(_.map(accounts, function(account) {
      return _.map(account.addresses, function(v, k) {
        return k;
      })
    }));
    if (addresses.indexOf(address) > -1) {
      t.$addAssetErrorLabel.removeClass("hidden")
    } else {
      t.$addAssetErrorLabel.addClass("hidden")
    }
  },
  'submit #add-address-form': function(e, t) { //TAG: assets
    if (!isOwnAssets()) return false;
    var account = CF.UserAssets.currentAccountKey.get();
    var address = t.$addAssetInput.val().trim();
    analytics.track('Added Address', {
      accountName: account,
      address: address
        //autoupdate
    });
    if (CF.UserAssets.uiAddressExists(address)) return false;
    Meteor.call("cfAssetsAddAddress", account, address, function(err, ret) {
      t.$addAssetInput.val("");
      t.$("#modal-add-address").closeModal();
    })
    return false;
  },
  'submit #delete-address-form': function(e, t) {
    if (!isOwnAssets()) return false;
    analytics.track('Deleted Address', {
      accountName: CF.UserAssets.currentAccountKey.get(),
      address: CF.UserAssets.currentAddress.get()
    });
    Meteor.call("cfAssetsRemoveAddress", CF.UserAssets.currentAccountKey.get(),
      CF.UserAssets.currentAddress.get());
    $("#modal-delete-address").closeModal();
    return false;
  },

  'click .per-account': function(e, t) {
    if (!isOwnAssets()) return;
    var accountKey = t.$(e.currentTarget).closest(".account-item").attr("account-key");
    CF.UserAssets.currentAccountKey.set(accountKey.toString());
  },
  'submit #add-asset-form': function(e, t) {
    if (!isOwnAssets()) return false;
    var $form = $(e.currentTarget).closest("form");
    var $target = $form.find("#asset-quantity-input");
    var key = CF.UserAssets.currentAsset.get();
    if (key) {
      key = key._id
    }
    if (!key) {
      Materialize.toast("please pick a coin", 4000);
      return false;
    }
    var qua = $target.val().trim();
    if (!qua && qua !== 0) {
      var $label = $target.closest(".number-sum-wrapper").find("label");
      $label.removeClass('hidden');
      $target.addClass('invalid');
      return false;
    }
    try {
      qua = parseFloat(qua);
    } catch (e) {
      return false;
    }
    $form.find("#asset-quantity-input").val('');
    analytics.track('Added Asset', {
      amount: qua,
      systemName: key,
      address: CF.UserAssets.currentAddress.get(),
      accountName: CF.UserAssets.currentAccountKey.get()
    });
    analytics.track('Followed System', {
      systemName: key,
      mode: 'auto'
    });
    Meteor.call("starSysBySys", key);
    Meteor.call("cfAssetsAddAsset", CF.UserAssets.currentAccountKey.get(), CF.UserAssets.currentAddress.get(), key, qua, function() {
      $form.closest(".modal").closeModal();
    });

    return false;
  },
  "autocompleteselect input#search2": function(event, template, doc) {
    if (!isOwnAssets()) return;
    CF.UserAssets.currentAsset.set(doc ? doc : null);
    template.$("input#search2").val("");
    //Meteor.setTimeout(function () {
    $("#asset-quantity-input").focus();
    //}, 40)
  },
  //todo move into dedicated template?
  'keyup .number-sum, change .munber-sum': function(e, t) {
    var $target = t.$(e.currentTarget);
    var $label = $target.closest(".number-sum-wrapper").find("label");
    var val = $target.val().trim();

    if (val) {
      var test = parseFloat(val);
      if (isNaN(test)) {
        $label.removeClass('hidden');
        $target.addClass('invalid');
      } else {
        $label.addClass('hidden');
        $target.removeClass('invalid');
      }
    }
  },
  'submit #edit-asset-form': function(e, t) {
    if (!isOwnAssets()) return false;
    var $form = $(e.currentTarget);
    var $target = $form.find("#asset-quantity-edit");
    var key = CF.UserAssets.currentAsset.get();
    if (key) {
      key = key._id
    }
    if (!key) {
      $form.closest(".modal").closeModal();
      return false;
    }
    var qua = $target.val().trim();
    if (!qua) {
      var $label = $target.closest(".number-sum-wrapper").find("label");
      $label.removeClass('hidden');
      $target.addClass('invalid');
      return false;
    }
    try {
      qua = parseFloat(qua);
    } catch (e) {
      return false;
    }
    $form.find("#asset-quantity-edit").val('');
    analytics.track('Updated Amount Manually', {
      amount: qua,
      systemName: key,
      address: CF.UserAssets.currentAddress.get(),
      accountName: CF.UserAssets.currentAccountKey.get()
    });
    Meteor.call("cfAssetsAddAsset", CF.UserAssets.currentAccountKey.get(), CF.UserAssets.currentAddress.get(), key, qua, function() {
      $form.closest(".modal").closeModal();
    });
    return false;
  },
  'submit #delete-asset-form': function(e, t) {
    if (!isOwnAssets()) return false;
    var sys = CF.UserAssets.currentAsset.get();
    if (sys) sys = sys._id; //todo: provide getter.

    if (!sys) {
      t.$("#modal-delete-asset").closeModal();
      return false;
    }
    analytics.track('Deleted Asset', {
      accountName: CF.UserAssets.currentAccountKey.get(),
      address: CF.UserAssets.currentAddress.get(),
      systemName: sys
    });
    Meteor.call("cfAssetsDeleteAsset", CF.UserAssets.currentAccountKey.get(), CF.UserAssets.currentAddress.get(), sys,
      function(err, ret) {
        CF.UserAssets.currentAsset.set(null);
        t.$("#modal-delete-asset").closeModal();
      });
    return false;
  },
  'submit #toggle-private-form': function(e, t) {
    //{{! todo: add check if user is able using this feature}}
    if (!isOwnAssets()) return false;
    Meteor.call('cfAssetsTogglePrivacy', CF.UserAssets.currentAccountKey.get(),
      CF.UserAssets.getAccountPrivacyType(Meteor.userId(), CF.UserAssets.currentAccountKey.get()),
      function(err, ret) {
        t.$("#modal-toggle-private").closeModal();
      });
    return false;
  }
});
