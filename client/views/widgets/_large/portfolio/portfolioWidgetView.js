var cfCDs = CF.CurrentData .selectors;
var ns = CF.UserAssets


// TODO: DEFLATE - DEDUPE
var getSumB = function (accountsData) {
  var systems = ns.getSystemsFromAccountsObject(accountsData),
    sum = 0;
  _.each(systems, function (sys) {
    var q = ns.getQuantitiesFromAccountsObject(accountsData, sys);
    var system = CurrentData.findOne(cfCDs.system(sys));

    if (system && system.metrics && system.metrics.price && system.metrics.price.btc) {
      sum += q * system.metrics.price.btc;
    }
  });
  return sum;
};

var getSumU = function (accountsData) {
  var systems = ns.getSystemsFromAccountsObject(accountsData),
    sum = 0;
  _.each(systems, function (sys) {
    var q = ns.getQuantitiesFromAccountsObject(accountsData, sys);
    var system = CurrentData.findOne(cfCDs.system(sys));

    if (system && system.metrics && system.metrics.price && system.metrics.price.usd) {
      sum += q * system.metrics.price.usd;
    }
  });
  return sum;
};

var _getSumB = function (accountsData, addressesObject) {
  var systems = ns.getSystemsFromAccountsObject(accountsData),
    sum = 0;
  _.each(systems, function (sys) {
    var q = ns.getQuantitiesFromAddressesObject(addressesObject, sys);
    var system = CurrentData.findOne(cfCDs.system(sys));

    if (system && system.metrics && system.metrics.price && system.metrics.price.btc) {
      sum += q * system.metrics.price.btc;
    }
  });
  return sum;
};

var _getSumU = function (accountsData, addressesObject) {
  var systems = ns.getSystemsFromAccountsObject(accountsData),
    sum = 0;
  _.each(systems, function (sys) {
    var q = ns.getQuantitiesFromAddressesObject(addressesObject, sys);
    var system = CurrentData.findOne(cfCDs.system(sys));

    if (system && system.metrics && system.metrics.price && system.metrics.price.usd) {
      sum += q * system.metrics.price.usd;
    }
  });
  return sum;
};


Template['portfolioWidgetView'].helpers({
  sumB: function () {
    var accounts = CF.Accounts.userProfileData();
    var sumB = accounts ? getSumB(accounts) : 0;
    return CF.Utils.readableN(sumB, 3)
  },
  _sumB: function (addressesObject) {
    var accounts = CF.Accounts.userProfileData();
    var sumB = (accounts && addressesObject) ? _getSumB(accounts, addressesObject) : 0;
    return CF.Utils.readableN(sumB, 3)
  },
  _sumU: function (addressesObject) {
    var accounts = CF.Accounts.userProfileData();
    var sumB = (accounts && addressesObject) ? _getSumU(accounts, addressesObject) : 0;
    return CF.Utils.readableN(sumB, 0)
  },
  sumU: function () {
    var accounts = CF.Accounts.userProfileData();
    var sumU = accounts ? getSumU(accounts) : 0;
    return CF.Utils.readableN(sumU, 0)
  },
  showAccount: function(){
    return Session.get('hideAccount_'+this._id) ? '' : 'checked'
  },
  filteredAccountsData: function(){
    return CF.Accounts.userProfileData()
  }
})

Template['portfolioWidgetView'].events({
  'change .count-account': function(e, t){
    CF.Accounts.hiddenToggle(t.$(e.currentTarget).attr('account-id'))
  }
})
