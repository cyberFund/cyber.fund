// Write your package code here!
CF.CurrentData = {
  calculatables: {
    fields: { "calculatable": 1 },
    fieldsExclude: {'calculatable': 0},
    fieldName: "calculatable",
    timestamps: {
      fieldName: '_t_calc',
      fields: {'_t_calc': 1},
      fieldsExclude: {'_t_calc': 0}
    }
  },
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
    dependents: function (system) {  //systems that depend on current
      return {"dependencies": {$in:  [system]}};
    },
    dependencies: function (list) { //return system
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
