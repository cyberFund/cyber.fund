var ns = CF.CurrentData.calculatables;
var helpers = ns.lib.helpers;
var params = ns.lib.params;

ns.lib.calcs.calcCS = function calcCS(system) {
  var state = helpers._getState(system);
  var type = helpers._getType(system);
  // convert from links to 1/0
  var wt = system.calculatable.nLinksWithTag;
  if (!wt) {
    console.log("CS calculation: no links calculated for %s", system._id);
    return undefined;
  }

  var linkWeights = params.linkWeightsCS[type];
try {
  var flags = {
    site: helpers.linksScoreWeight( wt['Main'], linkWeights.d0),
    community: helpers.linksScoreWeight( wt['Community'], linkWeights.d0),
    updates: helpers.linksScoreWeight( wt['News'], linkWeights.d0),
    code: helpers.linksScoreWeight( (wt['Code'] + wt['code']), linkWeights.d0),
    science: helpers.linksScoreWeight( wt['Science'], linkWeights.d0),
    knowledge: helpers.linksScoreWeight( (wt['Publictaions'] + wt['paper']), linkWeights.d0),
  }
} catch (e) {
  console.log(type)
}

  if (state == "Public") {
    _.extend(flags, {
      buy: helpers.linksScoreWeight( wt['Exchange'], linkWeights.d1),
      hold: helpers.linksScoreWeight( (wt['Wallet'] + wt['wallet']), linkWeights.d1),
      analyze: helpers.linksScoreWeight( (wt['Analytics'] + wt['Exporer']), linkWeights.d1),
      earn: true ? 1 : 0
    });
  }

  var basic = "stub";
  var extended = "stub"; // see https://docs.google.com/spreadsheets/d/1YkrIitYD6FS2a4IEmBlfwAuCMgMwIKgU5JMHQzsfg-k/edit#gid=755429566&vpid=A1

  var keys = ['site', 'community', 'updates', 'code', 'science', 'knowledge'];

  var v = {};

  if (type && state) {
    v = params.weightsCS[type] || {};
    v = v[state] || {}
  }
  var sum = helpers.convolution(keys, v, flags);

  //if (sum == undefined) return undefined;

  return {
    details: flags,
    sum: sum,
    weights: v,
    tip: type,
    state: state
  }
};
