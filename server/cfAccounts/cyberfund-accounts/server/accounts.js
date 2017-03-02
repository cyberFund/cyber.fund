import {accountNameIsValid, findById} from '/imports/api/cf/accounts/utils'

Meteor.methods({
  cfAssetsAddAccount: function(obj) {
    if (!this.userId) return {
      err: "no userid"
    };
    // print("in add account", obj);
    check(obj, Match.ObjectIncluding({
      isPublic: Boolean,
      name: String
    }));

    var user = Meteor.users.findOne({
      _id: this.userId
    });
    if (!user) return;
    if (!accountNameIsValid(obj.name, this.userId)) return {
      err: "invalid acc name"
    };

    var key = Acounts.insert({
      name: obj.name,
      addresses: {},
      isPrivate: !obj.isPublic,
      refId: user._id
    });

    if (obj.address) Meteor.call("cfAssetsAddAddress", key, obj.address);

    return {
      newAccountKey: key
    };
  },

  cfAssetsRenameAccount: function(accountKey, newName) {
    var account = checkAllowed(accountKey, this.userId);
    if (!account) return false;
    var sel = {
      _id: accountKey
    };

    var checkName = accountNameIsValid(newName, this.userId, account.name);
    if (checkName) {
      var k = "name";
      var set = {
        $set: {}
      };
      set.$set[k] = newName.toString();
      Acounts.update(sel, set);
    }
  },
  cfAssetsTogglePrivacy: function(accountKey, fromKey) {
    //{{! todo: add check if user is able using this feature}}

    if (!checkAllowed(accountKey, this.userId)) return false;

    var user = Meteor.users.findOne({
      _id: this.userId
    });
    var account = findById(accountKey);
    var toKey = (fromKey == "accounts" ? "accountsPrivate" : "accounts"); //TODO - remove strings, not needed


    if (account.refId == this.userId) {
      // print("user " + this.userId + " ordered turning account " + account.name + " to", toKey);

      Acounts.update({
        _id: accountKey
      }, {
        $set: {
          isPrivate: (toKey == "accountsPrivate")
        }
      });
    }
  },

  cfAssetsRemoveAccount: function(accountKey) {
    if (checkAllowed(accountKey, this.userId)) //todo - maybe direct,
    // not method (setup allow/deny for collection)
      Acounts.remove({
        _id: accountKey
      });
  },

  cfAssetsAddAddress: function(accountKey, address) {
    if (!checkAllowed(accountKey, this.userId)) return;

    var key = _k(["addresses", address]);
    var set = {
      $set: {}
    };
    set.$set[key] = {
      assets: {}
    };
    //push account to dictionary of accounts, so can use in autocomplete later
    Acounts.update({
      _id: accountKey
    }, set);

    Meteor.call("cfAssetsUpdateBalances", {
      username: Meteor.user() && Meteor.user().username,
      accountKey: accountKey,
      address: address
    });
  }
});
