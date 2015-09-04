var balance = Npm.require("crypto-balance");
CF.checkBalance = balance;

Meteor.methods({
  /**
   * thin wrapper aroun Lars Kluge' crypto-balance package.
   * @param wallet_
   * @returns {*|promise}
   */
  cfCheckBalance: function (wallet_) { //obsolete, was only used for tests
    return CF.Utils.extractFromPromise(balance(wallet_));
  }
});
