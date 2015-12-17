var ns = CF.CurrentData.calculatables;

ns.lib.calcs.calcAM = function calcAM(system) {
  var flag = _.contains(_.values(CF.UserAssets.qMatchingTable),
  system._id);
  return {
    flag: flag,
    sum: flag ? 1 : 0
  }
}
