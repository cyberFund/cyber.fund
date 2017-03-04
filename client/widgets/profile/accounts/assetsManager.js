import {cfCurrentAsset, cfCurrentAddress, cfCurrentId} from '/imports/api/client/utils'
import {findByRefId, findById, accountNameIsValid} from '/imports/api/cf/accounts/utils'
import {addressExists} from '/imports/api/utils/accounts'
import {currentUid} from '/imports/api/cf/profile'
import {getAccountPrivacyType, getSystemsFromAccountsObject} from '/imports/api/cf/userAssets/utils'
import {username} from '/imports/api/utils/user'
import {currentUsername} from '/imports/api/cf/profile'
import {Meteor} from 'meteor/meteor'
var isOwnAssets = function(){
  console.log(currentUsername() == username())
  return currentUsername() == username();
}
function privateToString(private){ return private ? 'private': 'public'};
Template["assetsManager"].onCreated(function() {
  var instance = this;

  Tracker.autorun(function() {
    var user = Meteor.user();
    if (user && (user.username == FlowRouter.getParam("username"))) {
      var accounts = findByRefId(Meteor.userId());
      systems = getSystemsFromAccountsObject(accounts);
      Meteor.subscribe("assetsSystems", systems);
    }
  });
});

Template["assetsManager"].onRendered (function() {
  this.$renameAccountInput = this.$("#rename-account-in");
  this.$renameAccountErrorLabel = this.$("#account-rename-exists");
  this.$addAssetInput = this.$("#add-address-input");
  this.$addAssetErrorLabel = this.$("#add-address-error");
});

Template["assetsManager"].helpers({
  isOwnAssets: isOwnAssets,
  assetsOwnerId: function() {
    return currentUid();
  },
  _accounts: function() { //todo - pass as parameter.
    return findByRefId(currentUid()).fetch();
  },

  currentAccount: function() {
    if (!isOwnAssets()) return null;
    return findById(cfCurrentId.get());
  },
  currentAccountId: function() {
    if (!isOwnAssets()) return null;
    return cfCurrentId.get();
  },
  currentAddress: function() {
    if (!isOwnAssets()) return null;
    return cfCurrentAddress.get();
  },
  currentAsset: function() {
    if (!isOwnAssets()) return null;
    return cfCurrentAsset.get();
  },
  currentAmount: function() {
    if (!isOwnAssets) return "";
    var user = Meteor.user();
    var _id = cfCurrentId.get();

    var amount = findById(_id);
    if (!amount) return "";
    amount = amount.addresses;
    if (!amount) return "";
    amount = amount[cfCurrentAddress.get()];
    if (!amount) return "";
    amount = amount.assets;
    if (!amount) return "";
    key = cfCurrentAsset.get();
    if (key) key = key._id;
    if (amount) amount = (key ? amount[key] : "");
    if (!amount) return "";
    return amount.quantity || "";
  },

  privacyOpposite: function(key) {
    var account = findById(key);
    if (!account) return "";
    return privateToString(!account.isPrivate);
  }
});

Template["assetsManager"].events({
  "click .req-update-balance.per-address": function(e, t) { //todo: add checker per account/ per user
    //if (!isOwnAssets()) return;

    var $t = t.$(e.currentTarget);
    var uid = $t.closest(".assets-manager").attr("owner");
    $t.addClass("disabled");

    Meteor.call("cfAssetsUpdateBalances", {
      username: Meteor.user() && Meteor.user().username,
      accountKey: cfCurrentId.get(),
      address: cfCurrentAddress.get()
    }, function(er, re) {
      $t.removeClass("disabled");
    });
  },
  "click .per-account": function(e, t) {
    //if (!isOwnAssets()) return;
    var accountKey = t.$(e.currentTarget).closest(".account-item").attr("account-id");
    cfCurrentId.set(accountKey.toString());
  },

  "click .req-update-balance.per-account": function(e, t) {
    //todo: add checker per account/ per user
    //if (!isOwnAssets()) return;

    var $t = t.$(e.currentTarget);

    var uid = $t.closest(".assets-manager").attr("owner");
    $t.addClass("disabled");
    //$(".req-update-balance.per-address", $t.closest(".account-item"))
    //.addClass("disabled");

    Meteor.call("cfAssetsUpdateBalances", {
      userId: Meteor.userId(),
      accountKey: cfCurrentId.get()
        //  address: cfCurrentAddress.get()
    }, function(er, re) {
      $t.removeClass("disabled");
      //$ (".req-update-balance.per-address", $t.closest(".account-item"))
      //.removeClass("disabled");
    });
  },

  "submit #delete-account-form": function(e, t) {
    if (!isOwnAssets()) return false;
    analytics.track("Deleted Account", {
      accountName: cfCurrentId.get()
    });
    Meteor.call("cfAssetsRemoveAccount", cfCurrentId.get());
    $("#modal-delete-account").closeModal();
    return false;
  },
  "keyup #rename-account-in, change #rename-account-in": function(e, t) {
    if (!isOwnAssets()) return;
    var accountId = cfCurrentId.get();
    var names = _.map(findByRefId(Meteor.user()).fetch(), function(account){
      return (account._id === accountId) ? "" : account.name;
    });

    var oldName = findById(accountId) && findById(accountId).name || "";

    var invalidState = t.$renameAccountInput.hasClass("invalid");
    var validName = accountNameIsValid(t.$renameAccountInput.val().trim(), Meteor.userId(), oldName);

    if (invalidState && validName) { // => valid
      t.$renameAccountInput.removeClass("invalid");
      t.$renameAccountErrorLabel.addClass("hidden");
    }
    if (!invalidState && !validName) { // => invalid
      t.$renameAccountInput.addClass("invalid");
      t.$renameAccountErrorLabel.removeClass("hidden");
    }
  },

  "submit #rename-account-form": function(e, t) {
    if (!isOwnAssets()) return false;
    //var key = cfCurrentId.get();
    analytics.track("Renamed Account", {
      oldName: cfCurrentId.get(),
      newName: t.$renameAccountInput.val()
    });
    Meteor.call("cfAssetsRenameAccount", cfCurrentId.get(), t.$renameAccountInput.val());
    $("#modal-rename-account").closeModal();
    return false;
  },

  "keyup #add-address-input, change #add-address-input": function(e, t) {
    if (!isOwnAssets()) return;
    var address = t.$addAssetInput.val().trim();
    var accounts = Meteor.user.accounts || {};
    var addresses = _.flatten(_.map(accounts, function(account) {
      return _.map(account.addresses, function(v, k) {
        return k;
      });
    }));
    if (addresses.indexOf(address) > -1) {
      t.$addAssetErrorLabel.removeClass("hidden");
    } else {
      t.$addAssetErrorLabel.addClass("hidden");
    }
  },
  "submit #add-address-form": function(e, t) { //TAG: assets
    if (!isOwnAssets()) return false;
    var account = cfCurrentId.get();
    var address = t.$addAssetInput.val().trim();
    analytics.track("Added Address", {
      accountName: account,
      address: address
        //autoupdate
    });
    if (addressExists(address, Meteor.userId())) return false;
    Meteor.call("cfAssetsAddAddress", account, address, function(err, ret) {
      t.$addAssetInput.val("");
      t.$("#modal-add-address").closeModal();
    });
    return false;
  },
  "submit #delete-address-form": function(e, t) {
    t.$(e.currentTarget).addClass("submitted");
    if (!isOwnAssets()) return false;
    analytics.track("Deleted Address", {
      accountName: cfCurrentId.get(),
      address: cfCurrentAddress.get()
    });
    Meteor.call("cfAssetsRemoveAddress", cfCurrentId.get(),
      cfCurrentAddress.get(),  function(err, ret){
        t.$(e.currentTarget).removeClass("submitted");
      });
    $("#modal-delete-address").closeModal();
    return false;
  },
  "submit #add-asset-form": function(e, t) {
    if (!isOwnAssets()) return false;
    var $form = $(e.currentTarget).closest("form");
    var $target = $form.find("#asset-quantity-input");
    var key = cfCurrentAsset.get();
    if (key) {
      key = key._id;
    }
    if (!key) {
      Materialize.toast("please pick a coin", 4000);
      return false;
    }
    var qua = $target.val().trim();
    if (!qua && qua !== 0) {
      var $label = $target.closest(".number-sum-wrapper").find("label");
      $label.removeClass("hidden");
      $target.addClass("invalid");
      return false;
    }
    try {
      qua = parseFloat(qua);
    } catch (e) {
      return false;
    }
    $form.find("#asset-quantity-input").val("");
    analytics.track("Added Asset", {
      amount: qua,
      systemName: key,
      address: cfCurrentAddress.get(),
      accountName: cfCurrentId.get()
    });
    analytics.track("Followed System", {
      systemName: key,
      mode: "auto"
    });
    Meteor.call("starSysBySys", key);
    Meteor.call("cfAssetsAddAsset", cfCurrentId.get(), cfCurrentAddress.get(), key, qua, function() {
      $form.closest(".modal").closeModal();
    });

    return false;
  },
  "autocompleteselect input#search2": function(event, template, doc) {
    if (!isOwnAssets()) return;
    cfCurrentAsset.set(doc ? doc : null);
    template.$("input#search2").val("");
    //Meteor.setTimeout(function () {
    $("#asset-quantity-input").focus();
    //}, 40)
  },
  //todo move into dedicated template?
  "keyup .number-sum, change .munber-sum": function(e, t) {
    var $target = t.$(e.currentTarget);
    var $label = $target.closest(".number-sum-wrapper").find("label");
    var val = $target.val().trim();

    if (val) {
      var test = parseFloat(val);
      if (isNaN(test)) {
        $label.removeClass("hidden");
        $target.addClass("invalid");
      } else {
        $label.addClass("hidden");
        $target.removeClass("invalid");
      }
    }
  },
  "submit #edit-asset-form": function(e, t) {
    console.log(1)
    if (!isOwnAssets()) return false;
    console.log(2)
    var $form = $(e.currentTarget);
    var $target = $form.find("#asset-quantity-edit");
    var key = cfCurrentAsset.get();
    console.log(key)
    if (key) {
      key = key._id;
    }
    if (!key) {
      $form.closest(".modal").closeModal();
      return false;
    }
    var qua = $target.val().trim();
    if (!qua) {
      var $label = $target.closest(".number-sum-wrapper").find("label");
      $label.removeClass("hidden");
      $target.addClass("invalid");
      return false;
    }
    try {
      qua = parseFloat(qua);
    } catch (e) {
      return false;
    }
    $form.find("#asset-quantity-edit").val("");
    analytics.track("Updated Amount Manually", {
      amount: qua,
      systemName: key,
      address: cfCurrentAddress.get(),
      accountName: cfCurrentId.get()
    });
    Meteor.call("cfAssetsAddAsset", cfCurrentId.get(), cfCurrentAddress.get(), key, qua, function() {
      $form.closest(".modal").closeModal();
    });
    return false;
  },
  "submit #delete-asset-form": function(e, t) {
    if (!isOwnAssets()) return false;
    var sys = cfCurrentAsset.get();
    if (sys) sys = sys._id; //todo: provide getter.

    if (!sys) {
      t.$("#modal-delete-asset").closeModal();
      return false;
    }
    analytics.track("Deleted Asset", {
      accountName: cfCurrentId.get(),
      address: cfCurrentAddress.get(),
      systemName: sys
    });
    Meteor.call("cfAssetsDeleteAsset", cfCurrentId.get(), cfCurrentAddress.get(), sys,
      function(err, ret) {
        cfCurrentAsset.set(null);
        t.$("#modal-delete-asset").closeModal();
      });
    return false;
  },
  "submit #toggle-private-form": function(e, t) {
    //{{! todo: add check if user is able using this feature}}
    if (!isOwnAssets()) return false;

    Meteor.call("cfAssetsTogglePrivacy", cfCurrentId.get(),
      getAccountPrivacyType(cfCurrentId.get()),
      function(err, ret) {
        t.$("#modal-toggle-private").closeModal();
      });
    return false;
  }
});
