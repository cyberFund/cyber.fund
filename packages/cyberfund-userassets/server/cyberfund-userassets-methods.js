var logger = log4js.getLogger("assets-tracker");
Meteor.methods({
  cfAssetsUpdateBalance: function (accountKey, address) {
    console.log('he', accountKey, address);
    if (!this.userId) {
      return;
    }
    var sel = {_id: this.userId};
    var accounts = Meteor.users.findOne(sel).accounts || {};

    if (!accountKey) { //todo: update all balances for user
      //
      return;
    }
    if (!address) { //todo: update all balances for account
      //
      return;
    }
console.log('re');
    var asset = accounts[accountKey] && accounts[accountKey].addresses
      && accounts[accountKey].addresses[address];
    if (!asset) return;
    console.log(1);
    var set = {$set: {}};
    var key =  ['accounts', accountKey, 'addresses', address].join(".");
    console.log(key);
    set.$set[key] = {
      'treasures': {}
    };
    CF.checkBalance(address, Meteor.bindEnvironment(function (err, result) {
        if (!err && result) {
          _.each(result, function (item) {
            if (item.status != 'success') return;
            if (item.asset != 'BTC') return;
            var q;
            try {
              q = parseFloat(item.quantity)
            } catch (e) {
              q = item.quantity;
            }
            set.$set[key]['treasures'][item.asset] = {
              quantity: q,
              asset: item.asset,
              updatedAt: new Date(),
              service: item.service,
              address: item.address
            }
          });
          // if at least one result received
          console.log(_.keys(set.$set[key]));
          if (_.keys(set.$set[key]['treasures']).length) {
            set.$set[key]['meta'] = {
              "balance": "auto"
            };
            console.log(set);
            Meteor.users.update(sel, set);
          }
        }
      })
    );
  },

  "cfAssetsAddAddress": function (accountKey, address) {
    if (!this.userId) return;
    var userId = this.userId;
    var key = ["accounts", accountKey, "addresses", address].join(".");
    var set = {$set :{}};
    set.$set[key] = {};
    //push account to dictionary of accounts, so can use in autocomplete later
    Meteor.users.update({_id: userId}, set);
    Meteor.call("cfAssetsUpdateBalance", accountKey, address)
  },

  cfAssetsRemoveAddress: function (accountKey, asset) {
    var userId = this.userId;
    if (!userId) return;
    var key = ['accounts', accountKey, "addresses", asset].join(".");
    var unset = {$unset:{}};
    unset.$unset[key] = true;
    Meteor.users.update({_id: userId}, unset);
  },

  cfAssetsAddAccount: function(obj){
    if (!this.userId) return {err:"no userid"};
    var sel = {_id: this.userId};
    check (obj, {isPublic: Boolean, name: String});
    var user = Meteor.users.findOne(sel);
    if (!user.accounts) Meteor.users.update(sel, {$set: {accounts: {}}});

    if (!CF.UserAssets.accountNameIsValid(obj.name, user.accounts)) return {err:"invalid acc name"};
    var key = CF.UserAssets.nextKey(user.accounts);
    var $set = {};
    $set['accounts.'+key] = {
      name: obj.name,
      isPublic: obj.isPublic,
      addresses: {}
    };
    Meteor.users.update(sel, {$set: $set});
    return {newAccountKey: key};
  },

  cfAssetsRenameAccount: function(key, newName){
    if (!this.userId) return;
    var sel = {_id: this.userId};
    var accounts = Meteor.users.findOne(sel).accounts;
    if (!accounts || !accounts[key]) {
      console.log(accounts);
      console.log(key);
      return;
    }
    var checkName = CF.UserAssets.accountNameIsValid(newName, accounts, accounts[key].name);
    if (checkName) {
      var k = 'accounts.' + key + ".name";
      var set = {$set: {}};
      set.$set[k] = newName;
      Meteor.users.update(sel, set);
    }
  },
  cfAssetsRemoveAccount: function(key) {
    if (!this.userId) return;
    var k = 'accounts.'+ key;
    var unset = {$unset: {}};
    unset.$unset[k] = true;
    Meteor.users.update({_id: this.userId}, unset);
  }
});