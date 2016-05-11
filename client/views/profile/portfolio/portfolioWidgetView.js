var cfCDs = CF.CurrentData.selectors;
var ns = CF.UserAssets


// TODO: DEFLATE - DEDUPE
var getSumB = function(accountsData) {
  var systems = ns.getSystemsFromAccountsObject(accountsData),
    sum = 0;
  _.each(systems, function(sys) {
    var q = ns.getQuantitiesFromAccountsObject(accountsData, sys);
    var system = CurrentData.findOne(cfCDs.system(sys));

    if (system && system.metrics && system.metrics.price && system.metrics.price.btc) {
      sum += q * system.metrics.price.btc;
    }
  });
  return sum;
};

var getSumU = function(accountsData) {
  var systems = ns.getSystemsFromAccountsObject(accountsData),
    sum = 0;
  _.each(systems, function(sys) {
    var q = ns.getQuantitiesFromAccountsObject(accountsData, sys);
    var system = CurrentData.findOne(cfCDs.system(sys));

    if (system && system.metrics && system.metrics.price && system.metrics.price.usd) {
      sum += q * system.metrics.price.usd;
    }
  });
  return sum;
};


//mapreduce bro
var _getSumB = function(accountsData, addressesObject) {
  var systems = ns.getSystemsFromAccountsObject(accountsData),
    sum = 0;
  _.each(systems, function(sys) {
    var q = ns.getQuantitiesFromAddressesObject(addressesObject, sys);
    var system = CurrentData.findOne(cfCDs.system(sys));

    if (system && system.metrics && system.metrics.price && system.metrics.price.btc) {
      sum += q * system.metrics.price.btc;
    }
  });
  return sum;
};

var _getSumU = function(accountsData, addressesObject) {
  var systems = ns.getSystemsFromAccountsObject(accountsData),
    sum = 0;
  _.each(systems, function(sys) {
    var q = ns.getQuantitiesFromAddressesObject(addressesObject, sys);
    var system = CurrentData.findOne(cfCDs.system(sys));

    if (system && system.metrics && system.metrics.price && system.metrics.price.usd) {
      sum += q * system.metrics.price.usd;
    }
  });
  return sum;
};

Template['portfolioWidgetView'].helpers({
  sumB: function() {
    var assets = CF.Accounts.portfolioTableData();
    var sum = 0;
    if (_.keys(assets).length) {
      _.each(assets, function(asset) {
        sum += asset.vBtc || 0;
      });
    }

    return CF.Utils.readableN(sum, 3)
  },
  sumU: function() {
    var assets = CF.Accounts.portfolioTableData();
    var sum = 0;
    if (_.keys(assets).length) {
      _.each(assets, function(asset) {
        sum += asset.vUsd || 0;
      });
    }
    return CF.Utils.readableN(sum, 0)
  },
  filteredAccountsData: function() {
    return CF.Accounts.userProfileData()
  },
  flat: function() {
    return CF.Accounts.extractAssets(this);
  },
  flattenData: CF.Accounts.portfolioTableData
})

Template['pwvRow'].onRendered(function() {
  var t = this;
  t.$(".count-account").prop("checked", !CF.Accounts.isHidden(t.data._id));
});

Template['pwvRow'].helpers({
  _sumB: function(addressesObject) {
    var accounts = CF.Accounts.userProfileData();
    var sumB = (accounts && addressesObject) ? _getSumB(accounts, addressesObject) : 0;
    return CF.Utils.readableN(sumB, 3)
  },
  _sumU: function(addressesObject) {
    var accounts = CF.Accounts.userProfileData();
    var sumB = (accounts && addressesObject) ? _getSumU(accounts, addressesObject) : 0;
    return CF.Utils.readableN(sumB, 0)
  },
  showAccount: function() {
    return Session.get('hideAccount_' + this._id) ? '' : 'checked'
  },
})

Template['pwvRow'].events({
  'change .count-account': function(e, t) {
    CF.Accounts.hiddenToggle(t.$(e.currentTarget).attr('account-id'))
  }
})
