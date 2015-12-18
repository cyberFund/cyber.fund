var ns = CF.CurrentData.calculatables;
var helpers = ns.lib.helpers;
var params = ns.lib.params;

ns.lib.calcs.calcCS = function calcCS(system) {
  var stage = helpers._getStage(system);
  var t = helpers._getType(system);
  // convert from links to 1/0
  var wt = system.calculatable.nLinksWithTag;
  if (!wt) {
    console.log("CS calculation: no links calculated for %s", system._id);
    return undefined;
  }

  var flags = {
    site: helpers.linksScoreWeight( wt['Main'], params.linkWeightsCS.d0),
    community: helpers.linksScoreWeight( wt['Community'], params.linkWeightsCS.d0),
    updates: helpers.linksScoreWeight( wt['News'], params.linkWeightsCS.d0),
    code: helpers.linksScoreWeight( (wt['Code'] + wt['code']), params.linkWeightsCS.d0),
    science: helpers.linksScoreWeight( wt['Science'], params.linkWeightsCS.d0),
    knowledge: helpers.linksScoreWeight( (wt['Publictaions'] + wt['paper']), params.linkWeightsCS.d0),
  }

  if (stage == "Public") {
    _.extend(flags, {
      buy: helpers.linksScoreWeight( wt['Exchange'], params.linkWeightsCS.d1),
      hold: helpers.linksScoreWeight( (wt['Wallet'] + wt['wallet']), params.linkWeightsCS.d1),
      analyze: helpers.linksScoreWeight( (wt['Analytics'] + wt['Exporer']), params.linkWeightsCS.d1),
      earn: true ? 1 : 0
    });
  }

  var basic = "stub";
  var extended = "stub"; // see https://docs.google.com/spreadsheets/d/1YkrIitYD6FS2a4IEmBlfwAuCMgMwIKgU5JMHQzsfg-k/edit#gid=755429566&vpid=A1

  var keys = ['site', 'community', 'updates', 'code', 'science', 'knowledge'];

  var v = {};

  if (t && stage) {
    v = params.weightsCS[t] || {};
    v = v[stage] || {}
  }
  var sum = helpers.convolution(keys, v, flags);

  //if (sum == undefined) return undefined;

  return {
    details: flags,
    sum: sum,
    weights: v,
    tip: t,
    stage: stage
  }
};
