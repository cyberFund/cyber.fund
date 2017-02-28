import crc from '../../constants/return_codes'
import parse from './json_parser'

module.exports = function(str){
  if (typeof str !== 'string') return crc.ERROR
  try {
    return parse(str);
  } catch(e) {
    return crc.ERROR
  }
}
