var checkAllowed = function(accountKey, userId) { // TODO move to collection rules
  if (!userId) return false;
  var account = Acounts.findOne({
    _id: accountKey,
    refId: userId
  });
  return account;
};

var cfAccountsUtilsClient = {}
cfAccountsUtilsClient.privateToString = function(private){ return private ? 'private': 'public'};

module.exports = cfAccountsUtilsClient
