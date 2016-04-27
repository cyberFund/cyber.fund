Meteor.startup(function(){
  _Session.default('folioWidgetSort', {"f|byValue": -1});
  // todo: control this from UI
  _Session.default('portfolioOptions', {privateAssets: true})
});

//Template['portfolioWidget'].onCreated(function () {
  //var instance = this;
  /* *** this currently is subscribed at 'profile' template
  instance.autorun(function(){
    instance.subscribe('portfolioSystems', {});
  });*/
//});

var ns = CF.UserAssets

/**
 *
 * @param accountsData - accounts object
 * @returns {number} assets value in bitcoins
 */

// TODO: DEFLATE
var getSumB = function (accountsData) {
  var systems = ns.getSystemsFromAccountsObject(accountsData),
    sum = 0;
  _.each(systems, function (sys) {
    var q = ns.getQuantitiesFromAccountsObject(accountsData, sys);
    var system = CurrentData.findOne(CF.CurrentData.selectors.system(sys));

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
    var system = CurrentData.findOne(CF.CurrentData.selectors.system(sys));

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
    var system = CurrentData.findOne(CF.CurrentData.selectors.system(sys));

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
    var system = CurrentData.findOne(CF.CurrentData.selectors.system(sys));

    if (system && system.metrics && system.metrics.price && system.metrics.price.usd) {
      sum += q * system.metrics.price.usd;
    }
  });
  return sum;
};

function _isOwn(){
  var user = Meteor.user();
  return user && user.username && (user.username == FlowRouter.getParam('username'))
}

Template['portfolioWidgetTable'].helpers({
  values: function (obj) {
    return _.values(obj || {});
  },
  pSystems: function () { //  systems to display in portfolio table, including 'starred' systems
    var accounts = Template.instance().data && Template.instance().data.accountsData;
    var systems = ns.getSystemsFromAccountsObject(accounts);

    if (_isOwn()) {
      var user = Meteor.user();
      var stars = user.profile.starredSystems;
      if (stars && stars.length) {
        systems = _.uniq(_.union(systems, stars))
      }
    }

    var sort = {
      // sort portfolio items by their cost, from higher to lower.
      // return -1 if x > y; return 1 if y > x
      byValue: function (x, y) {
        var q1 = ns.getQuantitiesFromAccountsObject(accounts, x._id);
        var q2 = ns.getQuantitiesFromAccountsObject(accounts, y._id);
        return Math.sign(q2 * CF.CurrentData.getPrice(y) - q1 * CF.CurrentData.getPrice(x)) || Math.sign(q2 - q1);
      },
      byAmount: function (x, y) {
        var q1 = ns.getQuantitiesFromAccountsObject(accounts, x._id);
        var q2 = ns.getQuantitiesFromAccountsObject(accounts, y._id);
        return Math.sign(q2 - q1);
      },
      byEquity: function (x, y) {
        var q1 = (x.metrics && x.metrics.supply) ?
          ns.getQuantitiesFromAccountsObject(accounts, x._id)/ x.metrics.supply : 0;
        var q2 = (y.metrics && y.metrics.supply) ?
          ns.getQuantitiesFromAccountsObject(accounts, y._id) / y.metrics.supply: 0;

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
    if (!system._id) return NaN;
    var accounts = Template.instance().data && Template.instance().data.accountsData;

    return CF.Utils.readableN(ns.getQuantitiesFromAccountsObject(
      accounts, system._id), 3);
  },
  btcCost: function (system) {
    if (!system.metrics || !system.metrics.price || !system.metrics.price.btc) return "no btc price found..";

    var accounts = Template.instance().data && Template.instance().data.accountsData;
    return (ns.getQuantitiesFromAccountsObject(
      accounts, system._id) * system.metrics.price.btc).toFixed(3);
  },
  usdCost: function (system) {
    if (!system.metrics || !system.metrics.price || !system.metrics.price.usd) return "no usd price found..";
    var accounts = Template.instance().data && Template.instance().data.accountsData;

    return CF.Utils.readableN(ns.getQuantitiesFromAccountsObject(
        accounts, system._id) * system.metrics.price.usd, 2);
  },
  name_of_system: function () {
    return this._id
  },
  equity: function (system) {
    var q = 0.0;
    var accounts = Template.instance().data && Template.instance().data.accountsData;

    if (system._id) {
      q = ns.getQuantitiesFromAccountsObject(accounts, system._id);
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
    if (system._id) {
      q = ns.getQuantitiesFromAccountsObject(accounts, system._id);
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

Template['portfolioWidget'].helpers({
  subReady: function(){ return CF.subs.Assets && CF.subs.Assets.ready() }
})

Template['portfolioWidgetView'].helpers({
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
  }
})

Template['portfolioWidgetTable'].events({
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
