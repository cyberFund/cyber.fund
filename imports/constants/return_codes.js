
module.exports = {
  OK: 0,
  ERROR: 1,
  isOk: function(returnValue){
    return returnValue === this.OK
  },
  isNotOk: function(returnValue){
    return returnValue === this.ERROR
  }
}
