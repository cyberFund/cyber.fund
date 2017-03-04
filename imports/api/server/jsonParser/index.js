import crc from '/imports/constants/return_codes'
import wrappedParse from './json_wrapper'
import {FastData} from '/imports/api/collections'

var exp = {
  parseOrThrow: function(str){
    if (typeof(str) !== 'str') return crc.ERROR
    let ret = wrappedParse(str)
    if (crc.isNotOk(ret)){
      throw ("JSON.parse error")
    }
    return ret
  },
  parseOrFail: function(){
    if (typeof(str) !== 'str') return crc.ERROR
    let ret = wrappedParse(str)
    if (crc.isNotOk(ret)){
      return crc.ERROR
    }
    return ret
  }
}
module.exports = exp
