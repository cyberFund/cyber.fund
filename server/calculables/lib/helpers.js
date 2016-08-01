var helpers;

CF.CurrentData.calculatables.lib = CF.CurrentData.calculatables.lib || {};

helpers = {
  _getValue: function(v, k, subk) {
    var i;
    if (!v) {
      return 0;
    }
    i = v[k];
    if (!i) {
      return 0;
    }
    if (subk) {
      return i[subk] || 0;
    }
    return i || 0;
  },
  convolution: function(keys, v1, v2, subk1, subk2) {
    var i, sum;
    i = this;
    sum = _.reduce(_.map(keys, function(key) {
      var m1, m2;
      m1 = i._getValue(v1, key, subk1);
      m2 = i._getValue(v2, key, subk2);
      return m1 * m2;
    }), (function(memo, num) {
      return memo + num;
    }), 0);
    return sum;
  },
  multiplication: function(keys, v1, v2, subk1, subk2) {
    var i, ret;
    ret = {};
    i = this;
    _.each(keys, function(key) {
      var m1, m2;
      m1 = i._getValue(v1, key, subk1);
      m2 = i._getValue(v2, key, subk2);
      ret[key] = m1 * m2;
    });
    return ret;
  },
  _getState: function(system) {
    states = ["Pre-Public", "Private", "Project", "Public", "Running"];
    var state, states;
    state = system.descriptions && system.descriptions.state;
    if (!state || !_.contains(states, state)) {
      return undefined;
    }
    return state;
  },
  _getType: function(system) {
    var types;
    // todo: throw if type not in types?
    types = ["cryptocurrentcy", "cryptoasset", "cryptoservice", "cryptoproject", "fiat"];
    return system.descriptions && system.descriptions.system_type;
  },

  // score weight is between 0 and 1. see params.linkWeightsCS
  linksScoreWeight: function (n, weightsD){
    weightsD = weightsD || [];
    for (var i=0; i <= weightsD.length-1; i++){
      if (n<=weightsD[i][0]) return weightsD[i][1];
    }
    return 1;
  }
};

_.extend(CF.CurrentData.calculatables.lib, {helpers: helpers});
