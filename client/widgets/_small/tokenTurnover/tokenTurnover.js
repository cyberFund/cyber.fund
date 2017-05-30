import {turnover} from '/imports/api/currentData/token/turnover'
import {readableN} from '/imports/api/utils/formatters'

Template['tokenTurnover'].helpers({
  turnover: function (sys) {
    let val = turnover(sys) || 0
    return val
  }
})
