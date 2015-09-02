
// this only works for current user.
CF.UserAssets.getAccountsObject = function() {
  var user = Meteor.user(),
    options = Session.get("portfolioOptions");//todo: factor out
  if (!user) return {};
  var accounts = user.accounts
  /* no sooner than..
   if (options.privateAssets) {
   _.extend(accounts, user.accountsPrivate || {})

   }*/
  return accounts;
}

Template['portfolioWidget'].rendered = function () {
  this.subscribe('portfolioSystems', Session.get('portfolioOptions'))
};


// sort portfolio items by their cost, from higher to lower.
// return -1 if x > y; return 1 if y > x
CF.UserAssets.folioSortFunction = function (x, y) {
  if (x.token && x.token.token_symbol
    && y.token && y.token.symbol
    && x.metrics && x.metrics.price
    && y.metrics && y.metrics.price) {
    return  Math.sign(CF.UserAssets.getQuantitiesFromAccountsObject(
        CF.UserAssets.getAccountsObject(), y.token.token_symbol)* y.metrics.price.btc
      > CF.UserAssets.getQuantitiesFromAccountsObject(
        CF.UserAssets.getAccountsObject(), x.token.token_symbol)* x.metrics.price.btc);
  }

  if ((!x.token) || (!x.token.token_symbol)) return 1;
  if ((!y.token) || (!y.token.token_symbol)) return -1;

  var q1 = CF.UserAssets.getQuantitiesFromAccountsObject(
    CF.UserAssets.getAccountsObject(), x.token.token_symbol);

  var q2 = CF.UserAssets.getQuantitiesFromAccountsObject(
    CF.UserAssets.getAccountsObject(), y.token.token_symbol);

  if ((!q1) && q2) return 1;
  if ((!q2) && q1) return -1;

  if ((!x.metrics) || (!x.metrics.price)) return 1;
  if ((!y.metrics) || (!y.metrics.price)) return -1;
  return 0;
}

Template['portfolioWidget'].helpers({
  'gSystems': function () { //  systems to display in portfolio chart, only present in user assets
    var options = Session.get("portfolioOptions") || {},
      user = Meteor.user(),
      symbols = CF.UserAssets.getSymbolsFromAccountsObject(CF.UserAssets.getAccountsObject());
    var  r = CurrentData.find(CF.CurrentData.selectors.symbol(symbols));
    return r.fetch().sort(CF.UserAssets.folioSortFunction);
  },
  'pSystems': function () { //  systems to display in portfolio table, including 'starred' systems
    var options = Session.get("portfolioOptions") || {},
      user = Meteor.user(),
      symbols = CF.UserAssets.getSymbolsFromAccountsObject(CF.UserAssets.getAccountsObject())

    var stars = user.profile.starredSystems;
    if (stars && stars.length) {
      var plck = _.map(CurrentData.find({system: {$in: stars}},
        {fields: {'token.token_symbol': 1}}).fetch(), function (it) {
        return it.token && it.token.token_symbol;
      });
      symbols = _.union(symbols, plck)
    }
    var r = CurrentData.find(CF.CurrentData.selectors.symbol(symbols));
    return r.fetch().sort(CF.UserAssets.folioSortFunction);
  },
  quantity: function (system) {
    if (!system.token || !system.token.token_symbol) return NaN;

    return CF.UserAssets.getQuantitiesFromAccountsObject(
      CF.UserAssets.getAccountsObject(), system.token.token_symbol);
  }
  ,
  btcCost: function (system) {
    if (!system.token || !system.token.token_symbol) return "no token for that system";


    if (!system.metrics  || !system.metrics.price || !system.metrics.price.btc) return "no btc price found..";
    return (CF.UserAssets.getQuantitiesFromAccountsObject(
      CF.UserAssets.getAccountsObject(), system.token.token_symbol) * system.metrics.price.btc).toFixed(4);
  },
  usdCost: function (system) {
    if (!system.token || !system.token.token_symbol) return "no token for that system";

    if (!system.metrics || !system.metrics.price || !system.metrics.price.usd) return "no usd price found..";
    return (CF.UserAssets.getQuantitiesFromAccountsObject(
      CF.UserAssets.getAccountsObject(), system.token.token_symbol) * system.metrics.price.usd ).toFixed(2);
  }
});

Template['portfolioWidget'].events({
  'click .bar': function (e, t) {
    
  }
});