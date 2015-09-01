Template['portfolioWidget'].rendered = function () {
  
};

Template['portfolioWidget'].helpers({
  'pSystems': function () {
    var options = Session.get("portfolioOptions") || {},
      user = Meteor.user(),
      symbols = CF.UserAssets.getSymbolsFromAccountsObject(user.accounts)

    if (options.privateAssets) {
      symbols = _.union(symbols, CF.UserAssets.getSymbolsFromAccountsObject(user.accountsPrivate))
    }

    var stars = user.profile.starredSystems;
    if (stars && stars.length) {

      var plck = _.map(CurrentData.find({system: {$in: stars}},
        {fields: {'token.token_symbol': 1}}).fetch(), function (it) {
        return it.token && it.token.token_symbol;
      });
      symbols = _.union(symbols, plck)
    }
    return CurrentData.find(CF.CurrentData.selectors.symbol(symbols))
  },
  quantity: function(system){
    var user = Meteor.user();
    if (!system.token || !system.token.token_symbol || !user) return NaN;
    var accounts = user.accounts,
      options = Session.get("portfolioOptions");//todo: factor out
    console.log(accounts);
    return CF.UserAssets.getQuantitiesFromAccountsObject(
      accounts, system.token.token_symbol);


    /* no sooner than..
    if (options.privateAssets) {
      _.extend(accounts, user.accountsPrivate || {})
    }*/
  }
});

Template['portfolioWidget'].events({
  'click .bar': function (e, t) {
    
  }
});