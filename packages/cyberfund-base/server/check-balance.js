var balance = Npm.require("crypto-balance");

Meteor.methods({
    /**
     * thin wrapper aroun Lars Kluge' crypto-balance package.
     * @param wallet_
     * @returns {*|promise}
     */
    cfCheckBalance: function(wallet_){
        return CF.Utils.extractFromPromise(balance(wallet_));
    }
});