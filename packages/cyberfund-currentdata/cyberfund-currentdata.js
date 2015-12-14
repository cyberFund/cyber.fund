// Write your package code here!
CF.CurrentData = {
  calculatables: { // some field names, selectors etc
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
        system: name //MIGRATION 1: _id: name
      }
    },
    system: function (name) {
      if (_.isArray(name)) {
        return {system: {$in: name}} //MIGRATION 1: return {_id: {$in: name}}
      }
      return {system: name} //MIGRATION 1: return {_id: {$in: name}}
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
      return {"system": {$in: list}} //MIGRATION 1: return {_id: {$in: list}}
    }
  },
  getPrice: function (system) {
    return system.metrics && system.metrics.price
    && system.metrics.price.btc || 0;
  },
  getSystem: function (system) { //Migration 1: obsolete
    if (!system.system) return '';
    return system.system;
  },
  linksWithTag: function (links, tag) {
    if (!_.isArray(links)) return [];
    return _.filter(links, function (link) {
      return _.isArray(link.tags) && (link.tags.indexOf(tag) > -1);
    });
  },
  /* not needed yet..
  linksWithType: function (links, type) {
    if (!_.isArray(links)) return [];
    return _.filter(links, function (link) {
      return (link.type == type);
    });
  },*/
};
