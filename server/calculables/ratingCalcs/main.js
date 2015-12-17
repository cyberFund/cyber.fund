var ns = CF.CurrentData.calculatables;
var helpers = ns.lib.helpers;
var params = ns.lib.params;
var calcs = ns.lib.calcs;

CF.CurrentData.calculatables.addCalculatable('RATING', function(system) {
  var stage = helpers._getStage(system);
  var t = helpers._getType(system);

  var keys = ['CS', 'LV', 'WL', 'BR', 'AM', 'GR']

  var weights = params.weightsRATING[stage],
    vector = {
      CS: calcs.calcCS(system),
      LV: calcs.calcLV(system),
      WL: calcs.calcWL(system),
      BR: calcs.calcBR(system),
      AM: calcs.calcAM(system),
      GR: calcs.calcGR(system)
    };

  var weigths = params.weightsRATING[stage] || {},
    weighted = helpers.multiplication(keys, vector, weights, 'sum');

  var sum = _.reduce(_.map(keys, function(key) {
      return (weighted[key]);
    }),
    function(memo, num) {
      return memo + num;
    }, 0);

  return {
    vector: vector,
    weights: weights,
    weighted: weighted,
    sum: sum,
    tip: t,
    stage: stage
  }
});
