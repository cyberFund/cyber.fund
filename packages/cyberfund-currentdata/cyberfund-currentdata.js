// Write your package code here!
CF.CurrentData = {
  selectors: {
    system_symbol: function (name, symbol) {
      return {
        "token.token_symbol": symbol,
        system: name
      }
    },
    system: function (name) {
      if (_.isArray(name)) {
        return {system: {$in: name}}
      }
      return {system: name}
    },
    symbol: function (symbol) {
      if (_.isArray(symbol)) {
        return {"token.token_symbol": {$in: symbol}}
      }
      return {"token.token_symbol": symbol}
    },
    dependents: function (system) {
      return {"dependencies": system};
    },
    dependencies: function (list) {
      if (!_.isArray(list)) {
        list = [list];
      }
      return {"system": {$in: list}}
    }
  },
  getPrice: function (system) {
    if (!system.metrics) return 0;
    if (!system.metrics.price) return 0;
    if (!system.metrics.price.btc) return 0;
    return system.metrics.price.btc;
  },
  getSystem: function (system) {
    if (!system.system) return '';
    return system.system;
  }
};