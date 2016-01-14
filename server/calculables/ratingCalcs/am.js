var ns = CF.CurrentData.calculatables;

//this does not work as we switched to quantum.
ns.lib.calcs.calcAM = function calcAM(system) {
  //var flag = _.contains(_.values(CF.UserAssets.qMatchingTable),
  //system._id);
  return {
    flag: true,
    sum: 1
  }
}
