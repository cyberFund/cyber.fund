module.exports = function calcAM(system) {
  return {
    flag: true,
    sum: (system.flags && system.flags.quantum) ? 1 : 0
  }
}
