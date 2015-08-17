//todo: move into namespace

/**
 * specific client-side version to check account name is valid.
 * extracts current user's accounts and calls generic version
 * @param newName - name to check validness
 * @param oldName - to be used if rename is going on
 * @returns {boolean}
 */
CF.UserAssets.accNameIsValid = function(newName, oldName) {
  var user = Meteor.user();
  if (!user) return true;
  var accounts = user.accounts || {};
  return CF.UserAssets.accountNameIsValid(newName, accounts, oldName);
};

Template['addAccount'].rendered = function () {
  this.$name = this.$("#account-name");
  this.$failLabel = this.$("#account-name-exists");
  this.$publicCheckbox = this.$("#private-type");
};

Template['addAccount'].helpers({
  'disabledPrivates': function () {
    return 'disabled'
  }
});

Template['addAccount'].events({
  'click .btn-add-account': function (e, t) {
    t.$("#modal-add-account").openModal();
  },
  'keyup #account-name': function (e, t) {
    var invalidState = t.$name.hasClass("invalid");
    var validName = CF.UserAssets.accNameIsValid(t.$name.val());

    if (invalidState && validName) { // => valid
      t.$name.removeClass("invalid");
      t.$failLabel.closest("form").find("#account-name-exists").addClass("hidden")
    }
    if (!invalidState && !validName) { // => invalid
      t.$name.addClass("invalid");
      t.$failLabel.removeClass("hidden")
    }
  },
  'click .submit-add-account': function (e, t) {
    var isPublic = !t.$publicCheckbox.is(":checked");
    if (!CF.UserAssets.accNameIsValid(t.$name.val())) {
      t.$name.addClass("invalid");
      t.$failLabel.removeClass("hidden");
      return;
    }
    var name = t.$name.val();
    Meteor.call("cfAssetsAddAccount", {isPublic: isPublic, name: name}, function(err, ret){

      $('#account-name').val('');
      $("#modal-add-account").closeModal();
    });
  }
});