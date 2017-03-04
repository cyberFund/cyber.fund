import {helpers, params, calcs} from '/imports/api/server/calculatables'
import calculatables from '/imports/api/server/calculatables'
//const calcs = calculatables.calcs
console.log(calculatables)
calculatables.addCalculatable('RATING', function(system) {
  var state = helpers.getState(system);
  var type = helpers.getType(system);

  var keys = ['CS', 'LV', 'WL', 'BR', 'AM', 'GR']

  var weights = params.weightsRATING[state],
    vector = {
      CS: calcs.calcCS(system),
      LV: calcs.calcLV(system),
      WL: calcs.calcWL(system),
      //BR: calcs.calcBR(system),
      AM: calcs.calcAM(system),
      GR: calcs.calcGR(system)
    };

  var weigths = params.weightsRATING[state] || {},
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
    tip: type,
    state: state
  }
});
