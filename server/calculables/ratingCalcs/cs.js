var ns = CF.CurrentData.calculatables;
var helpers = ns.lib.helpers;
var params = ns.lib.params;

ns.lib.calcs.calcCS = function calcCS(system) {
  var state = helpers._getState(system);
  var type = helpers._getType(system);
  // convert from links to 1/0
  var withTag = system.calculatable.nLinksWithTag;
  var withType = system.calculatable.nLinksWithType;

  if (!withTag) {
    console.log("CS calculation: no links calculated for %s", system._id);
    return undefined;
  }

  // see `/server/calculables/lib/params.js: Line 156`
  var linkWeights = params.linkWeightsCS(state, type);
  var scoreWeight = helpers.linksScoreWeight;

  try {
    var flags = {

              // can use withType here as well
      site: scoreWeight (withTag['Main'], linkWeights.site),
      community: scoreWeight(withTag['Community'], linkWeights.community),
      updates: scoreWeight(withType['_update_'], linkWeights.updates),
      code: scoreWeight((withTag['Code'] + withTag['code']), linkWeights.code),
      science: scoreWeight(withTag['Science'], linkWeights.science),
      knowledge: scoreWeight((withTag['Publicaions'] + withTag['paper']), linkWeights.knoweledge),
      buy: scoreWeight(withTag['Exchange'], linkWeights.buy),
      hold: scoreWeight((withTag['Wallet'] + withTag['wallet']), linkWeights.hold),
      analyze: scoreWeight((withTag['Analytics'] + withTag['Exporer']), linkWeights.analyze),
      earn: scoreWeight( withType['earn'], linkWeights.earn )
    }
  } catch (e) {
    console.log(type);
    throw(e)
  }

  var basic = "stub";
  var extended = "stub"; // see https://docs.google.com/spreadsheets/d/1YkrIitYD6FS2a4IEmBlfwAuCMgMwIKgU5JMHQzsfg-k/edit#gid=755429566&vpid=A1

  var keys = ['site', 'community', 'updates', //todo: move to ../lib/params ?
  'code', 'science', 'knowledge',
  'buy', 'hold', 'analyze', 'earn'];

  var v = {};

  if (type && state) {
    v = params.weightsCS[type] || {};
    v = v[state] || {}
  }
  var sum = helpers.convolution(keys, v, flags);

  return {
    details: flags,
    sum: sum,
    weights: v,
    tip: type,
    state: state
  }
};
