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
  _getStage: function(system) {
    var stage, stages;
    stages = ['Dead', 'Pre-Public', 'Private', 'Project', 'Public', 'Running', 'live'];
    stage = system.descriptions && system.descriptions.state;
    if (!stage || !_.contains(stages, stage)) {
      return undefined;
    }
    return stage;
  },
  _getType: function(system) {
    var types;
    types = ['cryptocurrentcy', 'cryptoasset'];
    return system.descriptions && system.descriptions.system_type;
  }
};

_.extend(CF.CurrentData.calculatables.lib, {helpers: helpers});
