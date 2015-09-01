function getAccountsObject(){
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

    var sortFunction = function(x, y){
      var q1 = CF.UserAssets.getQuantitiesFromAccountsObject(getAccountsObject(), x.token.token_symbol);
      var q2 = CF.UserAssets.getQuantitiesFromAccountsObject(getAccountsObject(), y.token.token_symbol);

      if (x && x.metrics && x.metrics.price && x.token && x.token.token_symbol &&
        y && y.metrics && y.metrics.price && y.token && y.token.token_symbol) {
        var p1 = x.metrics.price.btc,
          p2 = y.metrics.price.btc;

        if (q1 == 0 && q2>0) return 1;
        if (q2 == 0 && q1>0) return -1;
        return -Math.sign (p1 * q1 > p2 * q2);
      } else {
        if (q1 == 0 && q2>0) return 1;
        if (q2 == 0 && q1>0) return -1;
        if (x && x.metrics && x.metrics.price && x.token && x.token.token_symbol) return -1
        if (y && y.metrics && y.metrics.price && y.token && y.token.token_symbol) return 1
        return -Math.sign(x > y);
      }
    }

    return r.fetch().sort(sortFunction);
  },
  quantity: function(system){
    if (!system.token || !system.token.token_symbol) return NaN;

    return CF.UserAssets.getQuantitiesFromAccountsObject(
      getAccountsObject() , system.token.token_symbol);
  },
  btcCost: function(system){
    if (!system.token || !system.token.token_symbol) return "no token for that system";


    if (system.metrics && (!system.metrics.price || !system.metrics.price.btc)) return "no btc price found..";
    return CF.UserAssets.getQuantitiesFromAccountsObject(
        getAccountsObject() , system.token.token_symbol) * system.metrics.price.btc;
  },
  usdCost: function(system){
    if (!system.token || !system.token.token_symbol) return "no token for that system";

    if (system.metrics && (!system.metrics.price || !system.metrics.price.usd)) return "no usd price found..";
    return CF.UserAssets.getQuantitiesFromAccountsObject(
        getAccountsObject() , system.token.token_symbol) * system.metrics.price.usd;
  }
});

Template['portfolioWidget'].events({
  'click .bar': function (e, t) {
    
  }
});