var ns = CF.CurrentData.calculatables;
var helpers = ns.lib.helpers;
var params = ns.lib.params;

ns.lib.calcs.calcCS = function calcCS(system) {
  var stage = helpers._getStage(system);
  var t = helpers._getType(system);
  // convert from links to 1/0
  var wt = system.calculatable.nLinksWithTag;
  if (!wt) {
    console.log("CS calculation: no links calculated for "
     + system._id);
    return undefined;
  }

  var flags = {
    site: wt['Main'] ? 1 : 0,
    community: wt['Community'] ? 1 : 0,
    updates: wt['News'] ? 1 : 0,
    code: (wt['Code'] || wt['code']) ? 1 : 0,
    science: wt['Science'] ? 1 : 0,
    knowledge: (wt['Publictaions'] || wt['paper']) ? 1 : 0,
  }

  if (stage == "Public") {
    _.extend(flags, {
      buy: wt['Exchange'] ? 1 : 0,
      hold: (wt['Wallet'] || wt['wallet']) ? 1 : 0,
      analyze: (wt['Analytics'] || wt['Exporer']) ? 1 : 0,
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
    stage:stage
  }
};
