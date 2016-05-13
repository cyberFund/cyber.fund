var ns = CF.CurrentData.calculatables;

//this does not work as we switched to quantum.
ns.lib.calcs.calcAM = function calcAM(system) {
  return {
    flag: true,
    sum: (system.flags && system.flags.quantum) ? 1 : 0
  }
}
