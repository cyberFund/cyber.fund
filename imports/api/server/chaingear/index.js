import winston from 'winston'
import {parseOrFail} from '../jsonParser'
import crc from '/imports/constants/return_codes'

var chaingearData = {status: 'noinit'}
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
  });
}

module.exports = {
  reinit: function(){
    chaingearData.status = 'fetching..'
    if (status !== 'fetching..') {
      fetch(function(cbData){
        if (crc.isNotOk(cbData)) {
          chaingearData = {
            status: 'error'
          }
        } else {
          chaingearData = {
            status: 'fecthed',
            last: {
              timestamp: new Date().valueOf()
            },
            data: cbData
          }
        }
      });
    }
  },
  data: function(){
    return chaingearData.data
  }
}
