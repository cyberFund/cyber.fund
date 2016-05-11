var ns = CF.Accounts
ns.currentId = new CF.Utils.SessionVariable('cfAccountsCurrentId');

Template['assetsManager'].onRendered (function() {
  this.$renameAccountInput = this.$("#rename-account-in");
  this.$renameAccountErrorLabel = this.$("#account-rename-exists");
  this.$addAssetInput = this.$("#add-address-input");
  this.$addAssetErrorLabel = this.$("#add-address-error");
});

var isOwnAssets = Blaze._globalHelpers.isOwnAssets

Template['assetsManager'].helpers({
  assetsOwnerId: function() {
    return CF.Profile.currentUid()
  },

  _accounts: function() { //todo - pass as parameter.
    return CF.Accounts._findByUserId(CF.Profile.currentUid()).fetch();
  },

  currentAccount: function() {
    if (!isOwnAssets()) return null;
    return CF.Accounts.findById(CF.Accounts.currentId.get())
  },
  currentAccountId: function() {
    if (!isOwnAssets()) return null;
    return CF.Accounts.currentId.get();
  },
  currentAddress: function() {
    if (!isOwnAssets()) return null;
    return CF.Accounts.currentAddress.get();
  },
  currentAsset: function() {
    if (!isOwnAssets()) return null;
    return CF.Accounts.currentAsset.get();
  },
  currentAmount: function() {
    if (!isOwnAssets) return '';
    var user = Meteor.user();
    var _id = CF.Accounts.currentId.get();

    var amount = CF.Accounts.findById(_id);
    if (!amount) return '';
    amount = amount.addresses;
    if (!amount) return '';
    amount = amount[CF.Accounts.currentAddress.get()];
    if (!amount) return '';
    amount = amount.assets;
    if (!amount) return '';
    key = CF.Accounts.currentAsset.get();
    if (key) key = key._id;
    if (amount) amount = (key ? amount[key] : '');
    if (!amount) return '';
    return amount.quantity || '';
  },
  showAccountsAdvertise: function() {
    var instance = Template.instance();
    if (CF.subs.Assets.ready()) {
      if (CF.Profile.currentUsername() == CF.User.username()) {
        var user = Meteor.users.findOne({
          _id: CF.Profile.currentUid()
        });
        return !(ns._findByUserId(user._id).count())
      }
      return false;
    } else return false
  },
  privacyOpposite: function(key) {
    var account = CF.Accounts.findById(key)
    if (!account) return '';
    return ns.privateToString(!account.isPrivate);
  }
});

Template['assetsManager'].onCreated(function() {
  var instance = this;

  //if own profile, else getting data from user' "profile.assets" -
  // this all going to be actual once we get to private accounts
  CF.subs.Assets = instance.subscribe('profileAssets', CF.Profile.currentUsername());
  Tracker.autorun(function() {
    var user = Meteor.user()
    if (user && (user.username == FlowRouter.getParam('username'))) {
      var accounts = CF.Accounts._findByUserId(Meteor.userId())
      systems = CF.UserAssets.getSystemsFromAccountsObject(accounts);
      Meteor.subscribe('assetsSystems', systems);
    }
  });
});

Template['assetsManager'].events({
  'click .req-update-balance.per-address': function(e, t) { //todo: add checker per account/ per user
    //if (!isOwnAssets()) return;

    var $t = t.$(e.currentTarget);
    var uid = $t.closest(".assets-manager").attr("owner");
    $t.addClass("disabled");

    Meteor.call("cfAssetsUpdateBalances", {
      username: Meteor.user() && Meteor.user().username,
      accountKey: CF.Accounts.currentId.get(),
      address: CF.Accounts.currentAddress.get()
    }, function(er, re) {
      $t.removeClass("disabled");
    });
  },
  'click .per-account': function(e, t) {
    //if (!isOwnAssets()) return;
    var accountKey = t.$(e.currentTarget).closest(".account-item").attr("account-id");
    CF.Accounts.currentId.set(accountKey.toString());
  },

  'click .req-update-balance.per-account': function(e, t) {
    //todo: add checker per account/ per user
    //if (!isOwnAssets()) return;

    var $t = t.$(e.currentTarget);

    var uid = $t.closest(".assets-manager").attr("owner");
    $t.addClass("disabled");
    //$(".req-update-balance.per-address", $t.closest(".account-item"))
    //.addClass("disabled");

    Meteor.call("cfAssetsUpdateBalances", {
      userId: Meteor.userId(),
      accountKey: CF.Accounts.currentId.get()
        //  address: CF.Accounts.currentAddress.get()
    }, function(er, re) {
      $t.removeClass("disabled");
      //$ (".req-update-balance.per-address", $t.closest(".account-item"))
      //.removeClass("disabled");
    });
  },

  'submit #delete-account-form': function(e, t) {
    if (!isOwnAssets()) return false;
    analytics.track('Deleted Account', {
      accountName: CF.Accounts.currentId.get()
    });
    Meteor.call("cfAssetsRemoveAccount", CF.Accounts.currentId.get());
    $("#modal-delete-account").closeModal();
    return false;
  },
  'keyup #rename-account-in, change #rename-account-in': function(e, t) {
    if (!isOwnAssets()) return;
    var accountId = CF.Accounts.currentId.get();
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
    //var key = CF.Accounts.currentId.get();
    analytics.track('Renamed Account', {
      oldName: CF.Accounts.currentId.get(),
      newName: t.$renameAccountInput.val()
    });
    Meteor.call("cfAssetsRenameAccount", CF.Accounts.currentId.get(), t.$renameAccountInput.val());
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
    var account = CF.Accounts.currentId.get();
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
    t.$(e.currentTarget).addClass('submitted')
    if (!isOwnAssets()) return false;
    analytics.track('Deleted Address', {
      accountName: CF.Accounts.currentId.get(),
      address: CF.Accounts.currentAddress.get()
    });
    Meteor.call("cfAssetsRemoveAddress", CF.Accounts.currentId.get(),
      CF.Accounts.currentAddress.get(),  function(err, ret){
        t.$(e.currentTarget).removeClass('submitted');
      });
    $("#modal-delete-address").closeModal();
    return false;
  },
  'submit #add-asset-form': function(e, t) {
    if (!isOwnAssets()) return false;
    var $form = $(e.currentTarget).closest("form");
    var $target = $form.find("#asset-quantity-input");
    var key = CF.Accounts.currentAsset.get();
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
      address: CF.Accounts.currentAddress.get(),
      accountName: CF.Accounts.currentId.get()
    });
    analytics.track('Followed System', {
      systemName: key,
      mode: 'auto'
    });
    Meteor.call("starSysBySys", key);
    Meteor.call("cfAssetsAddAsset", CF.Accounts.currentId.get(), CF.Accounts.currentAddress.get(), key, qua, function() {
      $form.closest(".modal").closeModal();
    });

    return false;
  },
  "autocompleteselect input#search2": function(event, template, doc) {
    if (!isOwnAssets()) return;
    CF.Accounts.currentAsset.set(doc ? doc : null);
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
    var key = CF.Accounts.currentAsset.get();
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
      address: CF.Accounts.currentAddress.get(),
      accountName: CF.Accounts.currentId.get()
    });
    Meteor.call("cfAssetsAddAsset", CF.Accounts.currentId.get(), CF.Accounts.currentAddress.get(), key, qua, function() {
      $form.closest(".modal").closeModal();
    });
    return false;
  },
  'submit #delete-asset-form': function(e, t) {
    if (!isOwnAssets()) return false;
    var sys = CF.Accounts.currentAsset.get();
    if (sys) sys = sys._id; //todo: provide getter.

    if (!sys) {
      t.$("#modal-delete-asset").closeModal();
      return false;
    }
    analytics.track('Deleted Asset', {
      accountName: CF.Accounts.currentId.get(),
      address: CF.Accounts.currentAddress.get(),
      systemName: sys
    });
    Meteor.call("cfAssetsDeleteAsset", CF.Accounts.currentId.get(), CF.Accounts.currentAddress.get(), sys,
      function(err, ret) {
        CF.Accounts.currentAsset.set(null);
        t.$("#modal-delete-asset").closeModal();
      });
    return false;
  },
  'submit #toggle-private-form': function(e, t) {
    console.log('there');
    //{{! todo: add check if user is able using this feature}}
    if (!isOwnAssets()) return false;

    Meteor.call('cfAssetsTogglePrivacy', CF.Accounts.currentId.get(),
      CF.UserAssets.getAccountPrivacyType(CF.Accounts.currentId.get()),
      function(err, ret) {
        t.$("#modal-toggle-private").closeModal();
      });
    return false;
  }
});
