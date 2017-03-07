import {CurrentData} from '/imports/api/collections'
var r = {}                // helpers related to collection CurrentData
import {extend} from 'lodash'
r.getPricesById = function (docId) {
  var doc = CurrentData.findOne({
    _id: docId
  }, {
    fields: {
      "metrics.price": 1
    }
  });
  return r.getPricesByDoc(doc);
}

extend (r, {
  selectors: {       // selectors to return elements of CurrentData collection
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
  },

  getPrice: function (system) {      // return actual Bitcoin price for system.
    return system.metrics && system.metrics.price
      && system.metrics.price.btc || 0;
  },

  linksWithTag: function (links, tag) {        // among CurrentData structures,
    if (!_.isArray(links)) return [];   // calc amount of links with given tag.
    return _.filter(links, function (link) {
      return _.isArray(link.tags) && _.contains (link.tags, tag);
    });
  },

  linksWithType: function (links, t) {      // among CurrentData structures,
    if (!_.isArray(links)) return [];    // calc amount of links of given type.
    return _.filter(links, function (link) {
      return (link.type === t);
    });
  },

  linksOfUpdate: function(links) {
    if (!_.isArray(links)) return [];    // calc amount of links of given type.
    var types = ['blog', 'reddit'];
    return _.filter(links, function (link) {
      return (_.contains (types, link.type) && link.rss )
    })
  },
  getPricesByDoc: function getPricesByDoc(doc) {
    var ret = doc && doc.metrics && doc.metrics.price && doc.metrics.price;
    if (ret && ret.eth && !ret.btc){
      var priceEth = r.getPricesById('Ethereum');
      if (priceEth) {
        ret.btc = ret.eth * priceEth.btc || 0;
        ret.usd = ret.eth * priceEth.usd || 0;
      }
    }
    return ret;
  }
});

module.exports = r
