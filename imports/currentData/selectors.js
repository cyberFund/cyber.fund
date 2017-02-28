import {CurrentData} from '/imports/api/collections'
export default {       // selectors to return elements of CurrentData collection
  system_symbol: function (name, symbol) {   // by system ChG name and token
    return {
      "token.symbol": symbol,
      _id: name
    }
  },
  system: function (name) {                            // by ChG system name
    if (_.isArray(name)) {
      return {_id: {$in: name}}
    }
    return {_id: name}
  },
  symbol: function (symbol) {                             // by token of ChG
    if (_.isArray(symbol)) {
      return {"token.symbol": {$in: symbol}}
    }
    return {"token.symbol": symbol}
  },

  dependents: function (system) {          // systems that depend on current.
    return {"dependencies": {$in: [system]}};
  },

  dependencies: function (list) {                           //return systems
    if (!_.isArray(list)) {
      list = [list];
    }
    return {"_id": {$in: list}}
  },
  crowdsales: function(){ return {crowdsales: {$exists: true}} },
  projects: function(){ return {'descriptions.state': 'Project'} }
}
