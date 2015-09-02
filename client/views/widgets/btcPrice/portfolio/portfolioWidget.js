function getAccountsObject() {
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

Template['portfolioWidget'].helpers({
  'pSystems': function () {
    var options = Session.get("portfolioOptions") || {},
      user = Meteor.user(),
      symbols = CF.UserAssets.getSymbolsFromAccountsObject(getAccountsObject())


    var stars = user.profile.starredSystems;
    if (stars && stars.length) {

      var plck = _.map(CurrentData.find({system: {$in: stars}},
        {fields: {'token.token_symbol': 1}}).fetch(), function (it) {
        return it.token && it.token.token_symbol;
      });
      symbols = _.union(symbols, plck)
    }
    var r = CurrentData.find(CF.CurrentData.selectors.symbol(symbols));

    // return -1 if x > y; return 1 if y > x
    var sortFunction = function (x, y) {
      if (!x.token || !x.token.token_symbol) return 1;
      if (!y.token || !y.token.token_symbol) return -1;


      var p1 =
      CF.UserAssets.getQuantitiesFromAccountsObject(
        getAccountsObject(), x.token.token_symbol) * x.metrics.price.btc
      var p2 =
        CF.UserAssets.getQuantitiesFromAccountsObject(
          getAccountsObject(), y.token.token_symbol) * y.metrics.price.btc
      return Math.sign(p2 > p1);
    }
    return r.fetch().sort(sortFunction);

  },
  quantity: function (system) {
    if (!system.token || !system.token.token_symbol) return NaN;

    return CF.UserAssets.getQuantitiesFromAccountsObject(
      getAccountsObject(), system.token.token_symbol);
  }
  ,
  btcCost: function (system) {
    if (!system.token || !system.token.token_symbol) return "no token for that system";


    if (system.metrics && (!system.metrics.price || !system.metrics.price.btc)) return "no btc price found..";
    return CF.UserAssets.getQuantitiesFromAccountsObject(
        getAccountsObject(), system.token.token_symbol) * system.metrics.price.btc;
  }
  ,
  usdCost: function (system) {
    if (!system.token || !system.token.token_symbol) return "no token for that system";

    if (system.metrics && (!system.metrics.price || !system.metrics.price.usd)) return "no usd price found..";
    return CF.UserAssets.getQuantitiesFromAccountsObject(
        getAccountsObject(), system.token.token_symbol) * system.metrics.price.usd;
  }
})
;

Template['portfolioWidget'].events({
  'click .bar': function (e, t) {
    
  }
});