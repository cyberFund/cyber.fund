let trail = function(obj){
    if (obj.omega) {
      console.log(obj.omega)
      delete obj.omega
    }
    return obj
  }
}

module.exports = {
  trail: trail
}
