
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

  selectors: { // selectors to return elements of CurrentData collection
    system_symbol: function (name, symbol) { // by system ChG name and token
      return {
        "token.token_symbol": symbol,
        _id: name
      }
    },
    system: function (name) { // by ChG system name
      if (_.isArray(name)) {
        return {_id: {$in: name}}
      }
      return {_id: name}
    },
    symbol: function (symbol) { // by token of ChG
      if (_.isArray(symbol)) {
        return {"token.token_symbol": {$in: symbol}}
      }
      return {"token.token_symbol": symbol}
    },

    dependents: function (system) {  // systems that depend on current.
      return {"dependencies": {$in: [system]}}; // single not plural.
    },

    dependencies: function (list) { //return systems
      if (!_.isArray(list)) {
        list = [list];
      }
      return {"_id": {$in: list}}
    }
  },

  getPrice: function (system) {      // return actual Bitcoin price for system.
    return system.metrics && system.metrics.price
      && system.metrics.price.btc || 0;
  },

  linksWithTag: function (links, tag) { // among CurrentData structures,
    if (!_.isArray(links)) return [];   // calc amount of links with given tag.
    return _.filter(links, function (link) {
      return _.isArray(link.tags) && _.contains (link.tags, tag);
    });
  },

  linksWithType: function (links, type) { // among CurrentData structures,
    if (!_.isArray(links)) return [];    // calc amount of links of given type.
    return _.filter(links, function (link) {
      return (link.type === type);
    });
  }
};
