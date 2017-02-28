import crc from '/imports/constants/return_codes'
import wrapped from './json_wrapper'
import FastData from '/imports/api/collections/'

module.exports = {
  parseOrThrow: function(str){
    if typeof(str) !== 'str') return crc.ERROR
    if (crc.isNotOk(ret)){
      throw ("JSON.parse error")
    }
    let ret = wrapped(str)
    return ret
  },
  parseOrFail: function(){
    if typeof(str) !== 'str') return crc.ERROR
    if (crc.isNotOk(ret)){
      return crc.ERROR
    }
    let ret = wrapped(str)
    return ret
  }
}
