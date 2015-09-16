CF.UserAssets.currentAccount = new CF.Utils.SessionVariable('cfAssetsCurrentAccount');
var isOwnAssets = function () {
  return Meteor.userId() &&
    CF.Profile.currentUid.get() == Meteor.userId();
};

Template['assetsManager'].rendered = function () {
  this.$renameAccountInput = this.$("#rename-account-in");
  this.$renameAccountErrorLabel = this.$("#account-rename-exists");
  this.$addAssetInput = this.$("#add-address-input");
  this.$addAssetErrorLabel = this.$("#add-address-error");
};

Template['assetsManager'].helpers({
  isOwnAssets: function () {
    return isOwnAssets()
  },
  _accounts: function () {
    if (isOwnAssets()) {
      var accounts = Meteor.user().accounts
      _.extend(accounts, Meteor.user().accountsPrivate);
      return accounts;
    } else {
      var user = Meteor.users.findOne({_id: CF.Profile.currentUid.get()});
      if (!user) return {};
      return user.accounts
    }
  },
  currentAccount: function () {
    if (!isOwnAssets()) return null;
    var current = CF.UserAssets.currentAccount.get();
    var user = Meteor.user();
    if (!current || !user || !user.accounts || !user.accounts[current]) return {};
    return user.accounts[current];
  },
  currentAddress: function () {
    if (!isOwnAssets()) return null;
    return CF.UserAssets.currentAddress.get();
  },
  currentAsset: function () {
    if (!isOwnAssets()) return null;
    return CF.UserAssets.currentAsset.get();
  },
  currentAmount: function () {
    if (!isOwnAssets) return '';
    var user = Meteor.user();
    var amount = user.accounts;
    if (!amount) return '';
    var key = CF.UserAssets.currentAccount.get();
    if (!key) return ''
    amount = amount[key];
    if (!amount) return '';
    amount = amount.addresses;
    if (!amount) return '';
    amount = amount[CF.UserAssets.currentAddress.get()];
    if (!amount) return '';
    amount = amount.assets;
    if (!amount) return '';
    var key = CF.UserAssets.currentAsset.get();
    if (key) key = key.system;
    if (amount) amount = (key ? amount[key] : '');
    if (!amount) return '';
    return amount.quantity || '';
  }
});

Template['assetsManager'].onCreated(function () {
  var instance = this;

  //if own profile, else getting data from user' "profile.assets" -
  // this all going to be actual once we get to private accounts
  instance.subscribe('profileAssets', CF.Profile.currentTwid.get());
  Tracker.autorun(function () {
    var user = Meteor.users.findOneByTwid(CF.Profile.currentTwid.get());
    var systems = user && user.accounts
      && CF.UserAssets.getSystemsFromAccountsObject(user.accounts);

    Meteor.subscribe('assetsSystems', systems);
  });
});

Template['assetsManager'].events({
  'click .req-update-balance': function (e, t) {
    if (!isOwnAssets()) return;
    //var $assetrow = t.$(e.currentTarget).closest("tr");
    //var address = $assetrow.attr("asset-id");
    var $t = t.$(e.currentTarget);
    $t.addClass("disabled");
    Meteor.call("cfAssetsUpdateBalance", CF.UserAssets.currentAccount.get(), CF.UserAssets.currentAddress.get(),
      function (er, re) {
        $t.removeClass("disabled");
      });
  },
  'submit #delete-account-form': function (e, t) {
    if (!isOwnAssets()) return false;
    console.log(CF.UserAssets.currentAccount.get());
    Meteor.call("cfAssetsRemoveAccount", CF.UserAssets.currentAccount.get());
    $("#modal-delete-account").closeModal();
    return false;
  },
  showAccountsAdvertise: function () {
    if (CF.Profile.currentTwid.get() == CF.User.twid()) {
      var user = Meteor.users.findOne({_id: CF.Profile.currentUid.get()});
      return !(_.keys(user.accounts).length || _.keys(user.privateAccounts).length)
    }
    return false;
  },
  'keyup #rename-account-in, change #rename-account-in': function (e, t) {
    if (!isOwnAssets()) return;
    var accountId = CF.UserAssets.currentAccount.get();
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
  'submit #rename-account-form': function (e, t) {
    if (!isOwnAssets()) return false;
    var key = CF.UserAssets.currentAccount.get();
    Meteor.call("cfAssetsRenameAccount", CF.UserAssets.currentAccount.get(), t.$renameAccountInput.val());
    $("#modal-rename-account").closeModal();
    return false;
  },
  'keyup #add-address-input, change #add-address-input': function (e, t) {
    if (!isOwnAssets()) return;
    var address = t.$addAssetInput.val().trim();
    var accounts = Meteor.user.accounts || {};
    var addresses = _.flatten(_.map(accounts, function (account) {
      return _.map(account.addresses, function (v, k) {
        return k;
      })
    }));
    if (addresses.indexOf(address) > -1) {
      t.$addAssetErrorLabel.removeClass("hidden")
    } else {
      t.$addAssetErrorLabel.addClass("hidden")
    }
  },
  'submit #add-address-form': function (e, t) { //TAG: assets
    if (!isOwnAssets()) return false;
    var account = CF.UserAssets.currentAccount.get();
    var address = t.$addAssetInput.val().trim();
    if (CF.UserAssets.uiAddressExists(address)) return false;
    Meteor.call("cfAssetsAddAddress", account, address, function (err, ret) {
      t.$addAssetInput.val("");
      t.$("#modal-add-address").closeModal();
    })
    return false;
  },
  'submit #delete-address-form': function (e, t) {
    if (!isOwnAssets()) return false;
    Meteor.call("cfAssetsRemoveAddress", CF.UserAssets.currentAccount.get(),
      CF.UserAssets.currentAddress.get());
    $("#modal-delete-address").closeModal();
    return false;
  },

  'click .per-account': function (e, t) {
    if (!isOwnAssets()) return;
    var accountKey = t.$(e.currentTarget).closest(".account-item").attr("account-key");
    CF.UserAssets.currentAccount.set(accountKey.toString());
  },
  'submit #add-asset-form': function (e, t) {
    if (!isOwnAssets()) return false;
    var $form = $(e.currentTarget).closest("form");
    var $target = $form.find("#asset-quantity-input");
    var key = CF.UserAssets.currentAsset.get();
    if (key) {
      key = key.system
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
    Meteor.call("cfAssetsAddAsset", CF.UserAssets.currentAccount.get(), CF.UserAssets.currentAddress.get(), key, qua, function () {
      $form.closest(".modal").closeModal();
    });
    Meteor.call("starSysBySys", key);
    return false;
  },
  "autocompleteselect input#search2": function (event, template, doc) {
    if (!isOwnAssets()) return;
    CF.UserAssets.currentAsset.set(doc ? doc : null)
    template.$("input#search2").val("");
    //Meteor.setTimeout(function () {
    $("#asset-quantity-input").focus()
    //}, 40)
  },
  //todo move into dedicated template?
  'keyup .number-sum, change .munber-sum': function (e, t) {
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
  'submit #edit-asset-form': function (e, t) {
    if (!isOwnAssets()) return false;
    var $form = $(e.currentTarget);
    var $target = $form.find("#asset-quantity-edit");
    var key = CF.UserAssets.currentAsset.get();
    if (key) {
      key = key.system
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
    Meteor.call("cfAssetsAddAsset", CF.UserAssets.currentAccount.get(), CF.UserAssets.currentAddress.get(), key, qua, function () {
      $form.closest(".modal").closeModal();
    });
    return false;
  },
  'submit #delete-asset-form': function (e, t) {
    if (!isOwnAssets()) return false;
    var sys = CF.UserAssets.currentAsset.get();
    if (sys) sys = sys.system; //todo: provide getter.
    if (!sys) {
      t.$("#modal-delete-asset").closeModal();
      return false;
    }
    Meteor.call("cfAssetsDeleteAsset", CF.UserAssets.currentAccount.get(), CF.UserAssets.currentAddress.get(), sys,
      function (err, ret) {
        CF.UserAssets.currentAsset.set(null);
        t.$("#modal-delete-asset").closeModal();
      })
    return false;
  }
});