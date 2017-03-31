import {MarketData} from '/imports/api/collections'

const intervals = ['daily', 'hourly', '5m']

function getOneBySelector(selector, options){
  return MarketData.findOne(selector, options)
}

function getLatestBeforeDate(selector, date) {
  let sel = _.extend(selector, {timestamp: {$lte: date instanceof Date ? date : new Date()}})
  return getOneBySelector(sel, {sort: {timestamp: -1}})
}

module.exports = {
  getLatestBeforeDate: getLatestBeforeDate
}
