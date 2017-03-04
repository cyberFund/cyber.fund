import winston from 'winston'
import {parseOrFail} from '../jsonParser'
import crc from '/imports/constants/return_codes'
import { HTTP } from 'meteor/http'

var chaingearData = {status: 'noinit'}
function fetch(callback) {
  HTTP.get('http://api.cyber.fund/cg', {
    timeout: 10000
  }, function(err, res) {
    if (err) winston.log(`Coukd not fetch ${'http://api.cyber.fund/cg'}`, err, true)
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
    if (chaingearData.status !== 'fetching..') {
      chaingearData.status = 'fetching..'
      fetch(function(cbData){
        console.log(`chaingear data length: ${cbData.length}`)
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
