import winston from 'winston'
import {parseOrFail} from '../jsonParser'
import crc from '/imports/api/return_codes'
var chaingearData = {}
function fetch(callback) {
  HTTP.get('http://api.cyber.fund/cg', {
    timeout: 10000
  }, function(err, res) {
    if (err) winston.err(`Coukd not fetch ${'http://api.cyber.fund/cg'}`, err, true)
    else {
      if (res.data) {
        return callback(res.data)
      }
    }
    return crc.ERROR
  }
}

module.exports = {
  reinit: function(){
    chaingearData.status = 'fetching..'
    fetch(function(cbData){
      if (crc.isNotOk =
      chaingearData = {
        status: 'fecthed',
        last: {
          timestamp: new Date().valueOf()
        },
        data: cbData
      }
    })
  },
  data: function(){
    return chaingearData.data
  }
}
