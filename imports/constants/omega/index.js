module.exports = {
  trail: function(obj){
    if (obj.omega) {
      console.log(obj.omega)
      delete obj.omega
    }
    return obj
  }
}
