CF.UserAssets.currentAccount = new CF.Utils.SessionVariable('cfAssetsCurrentAccount');


Template['assetsManager'].rendered = function () {
  this.$renameAccountInput = this.$("#rename-account-in");
  this.$renameAccountErrorLabel = this.$("#account-rename-exists");
  this.$addAssetInput = this.$("#add-address-input");
  this.$addAssetErrorLabel = this.$("#add-address-error");
};

Template['assetsManager'].helpers({
  currentAccount: function () {
    var current = CF.UserAssets.currentAccount.get();
    var user = Meteor.user();
    if (!current || !user || !user.accounts || !user.accounts[current]) return {};
    return user.accounts[current];
  },
  currentAddress: function () {
    return CF.UserAssets.currentAddress.get();
  },
  currentAsset: function () {
    return CF.UserAssets.currentAsset.get();
  },
  currentAmount: function(){
    var user = Meteor.user();
    var amount = user.accounts;
    if (amount) amount = amount[CF.UserAssets.currentAccount.get()];
    if (amount) amount = amount.addresses;
    if (amount) amount = amount[CF.UserAssets.currentAddress.get()];
    if (amount) amount = amount.assets;
    if (amount) amount = amount[CF.UserAssets.currentAsset.get()];

  }
});

Template['assetsManager'].onCreated(function () {
  var instance = this;

  //if own profile, else getting data from user' "profile.assets" -
  // this all going to be actual once we get to private accounts
  instance.subscribe('ownAssets');
  Tracker.autorun(function () {
    var user = Meteor.user();
    var symbols = user && user.accounts && _.values(user.accounts);
    if (symbols) {
      symbols = _.flatten(_.map(symbols, function (account) {
        return _.values(account.addresses)
      }));
    }
    if (symbols) {
      symbols = _.flatten(_.map(symbols, function (address) {
        return _.keys(address.assets)
      }));
    }
    Meteor.subscribe('assetsSystems', symbols);
  });
});

Template['assetsManager'].events({
  'click .req-update-balance': function (e, t) {
    //var $assetrow = t.$(e.currentTarget).closest("tr");
    //var address = $assetrow.attr("asset-id");
    var $t = t.$(e.currentTarget);
    $t.addClass("disabled");
    Meteor.call("cfAssetsUpdateBalance", CF.UserAssets.currentAccount.get(), CF.UserAssets.currentAddress.get(),
      function (er, re) {
        console.log("here")
        $t.removeClass("disabled");
      });
  },
  'click .submit-remove-account': function (e, t) {
    console.log(CF.UserAssets.currentAccount.get());
    Meteor.call("cfAssetsRemoveAccount", CF.UserAssets.currentAccount.get());
    $("#modal-remove-account").closeModal();
  },
  'keyup #rename-account-in, change #rename-account-in': function (e, t) {
    var accountId = CF.UserAssets.currentAccount.get();
    var user = Meteor.user();
    if (!user || !user.accounts || !accountId || !user.accounts[accountId]) return;
    var oldName = user.accounts[accountId].name;

    var invalidState = t.$renameAccountInput.hasClass("invalid");
    var validName = CF.UserAssets.accNameIsValid(t.$renameAccountInput.val(), oldName);

    if (invalidState && validName) { // => valid
      t.$renameAccountInput.removeClass("invalid");
      t.$renameAccountErrorLabel.addClass("hidden")
    }
    if (!invalidState && !validName) { // => invalid
      t.$renameAccountInput.addClass("invalid");
      t.$renameAccountErrorLabel.removeClass("hidden")
    }
  },
  'click .submit-rename-account': function (e, t) {
    var key = CF.UserAssets.currentAccount.get();
    Meteor.call("cfAssetsRenameAccount", CF.UserAssets.currentAccount.get(), t.$renameAccountInput.val());
    $("#modal-rename-account").closeModal();
  },
  'keyup #add-address-input, change #add-address-input': function (e, t) {
    var address = t.$addAssetInput.val();
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
  'click .submit-add-address': function (e, t) { //TAG: assets
    var account = CF.UserAssets.currentAccount.get();
    var address = t.$addAssetInput.val();
    console.log(account, address);
    if (CF.UserAssets.uiAddressExists(address)) return;
    Meteor.call("cfAssetsAddAddress", account, address, function (err, ret) {
      t.$addAssetInput.val("");
      t.$("#modal-add-address").closeModal();
    })
  },
  'click .submit-remove-address': function (e, t) {
    Meteor.call("cfAssetsRemoveAddress", CF.UserAssets.currentAccount.get(),
      CF.UserAssets.currentAddress.get());
    $("#modal-remove-address").closeModal();
  },
  'click .per-account': function (e, t) {
    var accountKey = t.$(e.currentTarget).closest(".account-item").attr("account-key");
    CF.UserAssets.currentAccount.set(accountKey.toString());
  },
  'click .submit-add-asset': function (e, t) {
    var $form = $(e.currentTarget).closest("form");
    var $target = $form.find("#asset-quantity-input");
    var key = CF.UserAssets.currentAsset.get();
    if (key && key.token) {
      key = key.token.token_symbol
    }
    if (!key) {
      Materialize.toast("please pick a coin", 4000);
      return;
    }
    var qua = $target.val();
    if (!qua) {
      var $label = $target.closest(".number-sum-wrapper").find("label");
      $label.removeClass('hidden');
      $target.addClass('invalid');
      return;
    }
    try {
      qua = parseFloat(qua);
    } catch (e) {
      return;
    }
    $form.find("#asset-quantity-input").val('');
    Meteor.call("cfAssetsAddAsset", CF.UserAssets.currentAccount.get(), CF.UserAssets.currentAddress.get(), key, qua, function () {
      $form.closest(".modal").closeModal();
    });
  },
  "autocompleteselect input#search2": function (event, template, doc) {
    CF.UserAssets.currentAsset.set(doc ? doc : null)
    template.$("input#search2").val("");
    console.log(template.$("#asset-quantity-input"));
    //Meteor.setTimeout(function () {
    $("#asset-quantity-input").focus()
    //}, 40)
  },
  //todo move into dedicated template?
  'keyup .number-sum, change .munber-sum': function (e, t) {
    var $target = t.$(e.currentTarget);
    var $label = $target.closest(".number-sum-wrapper").find("label");
    var val = $target.val();

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
  }
});