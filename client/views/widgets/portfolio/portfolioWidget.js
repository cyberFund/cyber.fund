Meteor.startup(function(){
  _Session.default('folioWidgetSort', {"f|byValue": -1});

  // todo: control this from UI
  _Session.default('portfolioOptions', {privateAssets: true})
});

Template['portfolioWidget'].onCreated(function () {
  var instance = this;
  instance.autorun(function(){
    instance.subscribe('portfolioSystems', Meteor.userId(), _Session.get('portfolioOptions'));
  });
});

/**
 *
 * @param accountsData - accounts object
 * @returns {number} assets value in bitcoins
 */

// TODO: DEFLATE
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

var getSumU = function (accountsData) {
  var systems = CF.UserAssets.getSystemsFromAccountsObject(accountsData),
    sum = 0;
  _.each(systems, function (sys) {
    var q = CF.UserAssets.getQuantitiesFromAccountsObject(accountsData, sys);
    var system = CurrentData.findOne(CF.CurrentData.selectors.system(sys));

    if (system && system.metrics && system.metrics.price && system.metrics.price.usd) {
      sum += q * system.metrics.price.usd;
    }
  });
  return sum;
};

var _getSumB = function (accountsData, addressesObject) {
  var systems = CF.UserAssets.getSystemsFromAccountsObject(accountsData),
    sum = 0;
  _.each(systems, function (sys) {
    var q = CF.UserAssets.getQuantitiesFromAddressesObject(addressesObject, sys);
    var system = CurrentData.findOne(CF.CurrentData.selectors.system(sys));

    if (system && system.metrics && system.metrics.price && system.metrics.price.btc) {
      sum += q * system.metrics.price.btc;
    }
  });
  return sum;
};

var _getSumU = function (accountsData, addressesObject) {
  var systems = CF.UserAssets.getSystemsFromAccountsObject(accountsData),
    sum = 0;
  _.each(systems, function (sys) {
    var q = CF.UserAssets.getQuantitiesFromAddressesObject(addressesObject, sys);
    var system = CurrentData.findOne(CF.CurrentData.selectors.system(sys));

    if (system && system.metrics && system.metrics.price && system.metrics.price.usd) {
      sum += q * system.metrics.price.usd;
    }
  });
  return sum;
};

Template['portfolioWidget'].helpers({
  values: function (obj) {
    return _.values(obj || {});
  },
  'pSystems': function () { //  systems to display in portfolio table, including 'starred' systems

    // not used here, as we already have emplate.instance().data.accountsData,
    // either with or without private accounts. so,d be moved up the river
    var options = _Session.get("portfolioOptions") || {},

      accounts = Template.instance().data && Template.instance().data.accountsData,
      systems = CF.UserAssets.getSystemsFromAccountsObject(accounts);

    // display starred systems for own portfolio
    if (CF.Profile.currentUid() == Meteor.userId()) {
      var user = Meteor.user();
      var stars = user.profile.starredSystems;
      if (stars && stars.length) {

        var plck = _.map(CurrentData.find({system: {$in: stars}},
          {fields: {'system': 1}}).fetch(), function (it) {
          return it.system; //Migration 1: just use 'stars' array
        });

        systems = _.uniq(_.union(systems, plck))
      }
    }

    // mobile chrome can not into Math.sign itself
    Math.sign = Math.sign || function (x) {
        x = +x;
        if (x === 0 || isNaN(x)) {
          return x;
        }
        return x > 0 ? 1 : -1;
      };

    var sort = {
      // sort portfolio items by their cost, from higher to lower.
      // return -1 if x > y; return 1 if y > x
      byValue: function (x, y) {

        var q1 = CF.UserAssets.getQuantitiesFromAccountsObject(accounts, CF.CurrentData.getSystem(x)),
          q2 = CF.UserAssets.getQuantitiesFromAccountsObject(accounts, CF.CurrentData.getSystem(y));
        return Math.sign(q2 * CF.CurrentData.getPrice(y) - q1 * CF.CurrentData.getPrice(x)) || Math.sign(q2 - q1);
      },
      byAmount: function (x, y) {
        var q1 = CF.UserAssets.getQuantitiesFromAccountsObject(accounts, CF.CurrentData.getSystem(x)),
          q2 = CF.UserAssets.getQuantitiesFromAccountsObject(accounts, CF.CurrentData.getSystem(y));
        return Math.sign(q2 - q1);
      },
      byEquity: function (x, y) {
        var q1 = CF.UserAssets.getQuantitiesFromAccountsObject(accounts, x),
          q2 = CF.UserAssets.getQuantitiesFromAccountsObject(accounts, y);
        if (x.metrics && x.metrics.supply) {
          q1 = q1 / x.metrics.supply;
        } else {
          q1 = 0;
        }

        if (y.metrics && y.metrics.supply) {
          q2 = q2 / y.metrics.supply;
        } else {
          q2 = 0;
        }
        return Math.sign(q2 - q1);
      }
    };

    // for sorter values, see template file. 'f|' is for sorting by system field
    // like "by daily price change", no prefix is for using some sort function
    // from above
    var sorter = _Session.get('folioWidgetSort'),
      _sorter = sorter && _.isObject(sorter) && _.keys(sorter) && _.keys(sorter)[0],
      _split = (_sorter || '').split('|');

    if (_sorter && _split) {
      if (_split.length == 2 && _split[0] == 'f') {
        var r = CurrentData.find(CF.CurrentData.selectors.system(systems))
          .fetch()
          .sort(sort[_split[1]]);

        var val = sorter && _.isObject(sorter) && _.values(sorter)
          && _.values(sorter)[0];
        if (val == 1) r = r.reverse();
        return r;
      }
      return CurrentData.find(CF.CurrentData.selectors.system(systems), {sort: sorter})
    }
    return CurrentData.find(CF.CurrentData.selectors.system(systems))
      .fetch().sort(sort.byValue);
  },
  chartData: function () {
    return Template.instance().data && Template.instance().data.accountsData;
  },
  quantity: function (system) {
    if (!system.system) return NaN;  //Migration 1: system._id
    var accounts = Template.instance().data && Template.instance().data.accountsData;

    return CF.Utils.readableN(CF.UserAssets.getQuantitiesFromAccountsObject(
      accounts, system.system), 3); //Migration 1: system._id
  },
  btcCost: function (system) {
    if (!system.system) return "no token for that system"; //Migration 1: bypass
    if (!system.metrics || !system.metrics.price || !system.metrics.price.btc) return "no btc price found..";

    var accounts = Template.instance().data && Template.instance().data.accountsData;
    return (CF.UserAssets.getQuantitiesFromAccountsObject(
      accounts, system.system) * system.metrics.price.btc).toFixed(3); //Migration 1: system._id
  },
  usdCost: function (system) {
    if (!system.system) return "no token for that system"; //Migration 1: bypass
    if (!system.metrics || !system.metrics.price || !system.metrics.price.usd) return "no usd price found..";
    var accounts = Template.instance().data && Template.instance().data.accountsData;

    return CF.Utils.readableN(CF.UserAssets.getQuantitiesFromAccountsObject(
        accounts, system.system) * system.metrics.price.usd, 2);  //Migration 1: system._id
  },
  sumB: function () {
    var accounts = Template.instance().data && Template.instance().data.accountsData;
    var sumB = accounts ? getSumB(accounts) : 0;
    return CF.Utils.readableN(sumB, 3)
  },
  _sumB: function (addressesObject) {
    var accounts = Template.instance().data && Template.instance().data.accountsData;
    var sumB = (accounts && addressesObject) ? _getSumB(accounts, addressesObject) : 0;
    return CF.Utils.readableN(sumB, 3)
  },
  _sumU: function (addressesObject) {
    var accounts = Template.instance().data && Template.instance().data.accountsData;
    var sumB = (accounts && addressesObject) ? _getSumU(accounts, addressesObject) : 0;
    return CF.Utils.readableN(sumB, 0)
  },
  sumU: function () {
    var accounts = Template.instance().data && Template.instance().data.accountsData;
    var sumU = accounts ? getSumU(accounts) : 0;
    return CF.Utils.readableN(sumU, 0)
  },
  name_of_system: function () {
    var sys = CurrentData.findOne({_id: this._id}) || {};
    return sys.system || '' //Migration 1: return this._id
  },
  equity: function (system) {
    var q = 0.0;
    var accounts = Template.instance().data && Template.instance().data.accountsData;

    if (system.system) { //Migration 1:
      q = CF.UserAssets.getQuantitiesFromAccountsObject(accounts, system.system);  //Migration 1:
    }
    if (system.metrics && system.metrics.supply) {
      q = 10000 * q / system.metrics.supply
    }
    else {
      q = 0.0;
    }
    return CF.Utils.readableN(q, 3) + '‱';
  },
  share: function () {
    var system = this;
    var q = 0.0;
    var accounts = Template.instance().data && Template.instance().data.accountsData;
    if (system.system) {  //Migration 1:
      q = CF.UserAssets.getQuantitiesFromAccountsObject(accounts, system.system);  //Migration 1: 
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
  sorter: function (field) {
    var sorter = _Session.get("folioWidgetSort");
    if (!_.isObject(sorter)) return "";
    if (sorter[field] == -1) return "↓ ";
    if (sorter[field] == 1) return "↑ ";
    return "";
  }
});

Template['portfolioWidget'].events({

  'click th.sorter': function (e, t) {
    var newSorter = $(e.currentTarget).data('sorter');
    var sort = _Session.get("folioWidgetSort");
    // same sorting criteria - reverse order
    if (sort[newSorter]) {
      sort[newSorter] = -sort[newSorter];
    } else {
      sort = {};
      sort[newSorter] = -1;
    }
    analytics.track("Sorted Portfolio", {
      sort: sort
    });
    _Session.set('folioWidgetSort', sort);
  }
});
