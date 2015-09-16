Template['portfolioWidget'].rendered = function () {
  this.subscribe('portfolioSystems', Meteor.userId(), Session.get('portfolioOptions'))
};

/**
 *
 * @param accountsData - accounts object
 * @returns {number} assets value in bitcoins
 */
var getSumB = function (accountsData) {
  var systems = CF.UserAssets.getSystemsFromAccountsObject(accountsData),
    sum = 0;
  _.each(systems, function (sys) {
    var q = CF.UserAssets.getQuantitiesFromAccountsObject(accountsData, sys);
    var system = CurrentData.findOne(CF.CurrentData.selectors.system(sys));

    if (system && system.metrics && system.metrics.price && system.metrics.price.btc) {
      sum += q * system.metrics.price.btc;
    }
  });
  return sum;
};

Template['portfolioWidget'].helpers({
  'pSystems': function () { //  systems to display in portfolio table, including 'starred' systems
    var options = Session.get("portfolioOptions") || {},
      accounts = Template.instance().data && Template.instance().data.accountsData,
      systems = CF.UserAssets.getSystemsFromAccountsObject(accounts);
    if (CF.Profile.currentUid.get() == Meteor.userId()) {
      var user = Meteor.user();
      var stars = user.profile.starredSystems;
      if (stars && stars.length) {
        var plck = _.map(CurrentData.find({system: {$in: stars}},
          {fields: {'system': 1}}).fetch(), function (it) {
          return it.system;
        });
        systems = _.uniq(_.union(systems, plck))
      }
    }
    var r = CurrentData.find(CF.CurrentData.selectors.system(systems));

    // sort portfolio items by their cost, from higher to lower.
    // return -1 if x > y; return 1 if y > x
    sortFunction = function (x, y) {
      var getPrice = function (system) {
          if (!system.metrics) return 0;
          if (!system.metrics.price) return 0;
          if (!system.metrics.price.btc) return 0;
          return system.metrics.price.btc;
        },
        getSystem = function (system) {
          if (!system.system) return '';
          return system.system;
        },
        q1 = CF.UserAssets.getQuantitiesFromAccountsObject(accounts, getSystem(x)),
        q2 = CF.UserAssets.getQuantitiesFromAccountsObject(accounts, getSystem(y));
      return Math.sign(q2 * getPrice(y) - q1 * getPrice(x)) || Math.sign(q2 - q1);
    };
    return r.fetch().sort(sortFunction);
  },
  quantity: function (system) {
    if (!system.system) return NaN;
    var accounts = Template.instance().data && Template.instance().data.accountsData;

    return CF.Utils.readableN(CF.UserAssets.getQuantitiesFromAccountsObject(
      accounts, system.system), 3);
  },
  btcCost: function (system) {
    if (!system.system) return "no token for that system";
    if (!system.metrics || !system.metrics.price || !system.metrics.price.btc) return "no btc price found..";

    var accounts = Template.instance().data && Template.instance().data.accountsData;
    return (CF.UserAssets.getQuantitiesFromAccountsObject(
      accounts, system.system) * system.metrics.price.btc).toFixed(3);
  },
  chartData: function () {
    return Template.instance().data && Template.instance().data.accountsData;
  },
  usdCost: function (system) {
    if (!system.system) return "no token for that system";
    if (!system.metrics || !system.metrics.price || !system.metrics.price.usd) return "no usd price found..";
    var accounts = Template.instance().data && Template.instance().data.accountsData;

    return CF.Utils.readableN(CF.UserAssets.getQuantitiesFromAccountsObject(
        accounts, system.system) * system.metrics.price.usd, 2);
  },
  sumB: function () {
    var accounts = Template.instance().data && Template.instance().data.accountsData;
    var sumB = accounts ? getSumB(accounts) : 0;
    return CF.Utils.readableN(sumB, 3)
  },
  name_of_system: function () {
    var sys = CurrentData.findOne({_id: this._id}) || {};
    return sys.system || ''
  },
  equity: function (system) {
    var q = 0.0;
    var accounts = Template.instance().data && Template.instance().data.accountsData;

    if (system.system) {
      q = CF.UserAssets.getQuantitiesFromAccountsObject(accounts, system.system);
    }
    if (system.metrics && system.metrics.supply) {
      q = 10000 * q / system.metrics.supply
    }
    else {
      q = 0.0;
    }
    return CF.Utils.readableN(q, 3) + '‱';
  },
  share: function (system) {
    var q = 0.0;
    var accounts = Template.instance().data && Template.instance().data.accountsData;
    if (system.system) {
      q = CF.UserAssets.getQuantitiesFromAccountsObject(accounts, system.system);
    }
    var accountsData = Template.instance().data &&
      Template.instance().data.accountsData;
    var sum = accountsData ? getSumB(accountsData) : 0;

    if (system && system.metrics && system.metrics.price
      && system.metrics.price.btc && sum > 0.0) {
      return (100 * q * system.metrics.price.btc / sum).toFixed(1) + "%";
    }
    return "0%";
  },
  usdPrice: function () { //TODO: use package functions here.
    var system = this;
    if (system && system.metrics && system.metrics.price && system.metrics.price.usd) {
      return CF.Utils.readableN(system.metrics.price.usd, 2);
    }
    return 0;
  },
  usdPriceChange1d: function () {
    var system = this;
    if (system && system.metrics && system.metrics.priceChangePercents
      && system.metrics.priceChangePercents.day &&
      system.metrics.priceChangePercents.day.usd) {
      return system.metrics.priceChangePercents.day.usd;
    }
    return 0;
  },
  usdCap: function (system) {
    if (system && system.metrics && system.metrics.price &&
      system.metrics.price.usd && system.metrics.supply) {
      return CF.Utils.readableN((system.metrics.price.usd * system.metrics.supply), 0);
    }
    return 0;
  },
  sumU: function () {
    var accounts = Template.instance().data && Template.instance().data.accountsData,
      systems = CF.UserAssets.getSystemsFromAccountsObject(accounts),
      sum = 0;
    _.each(systems, function (sys) {
      var q = CF.UserAssets.getQuantitiesFromAccountsObject(accounts, sys);
      var system = CurrentData.findOne(CF.CurrentData.selectors.system(sys));

      if (system && system.metrics && system.metrics.price && system.metrics.price.usd) {
        sum += q * system.metrics.price.usd;
      }
    })
    return CF.Utils.readableN(sum, 0)
  }
});

Template['portfolioWidget'].events({
  'click .bar': function (e, t) {
    
  }
});