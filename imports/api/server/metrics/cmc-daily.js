import {CurrentData, MarketData} from '/imports/api/collections'
import {extend, map} from 'lodash'
import {handleArrayWithInterval} from '/imports/api/handleArray'

function startOfDay(date){
	if (!date instanceof Date) date = new Date()
	date.setUTCHours(0); date.setUTCMinutes(0); date.setUTCSeconds(0); date.setUTCMilliseconds(0)
	return date;
}

function getFromToMedian(date) {
	let from = startOfDay(date)
	let to = new Date(from.valueOf() + 24 * 60 * 60 * 1000)
	let median = new Date(from.valueOf() + 12 * 60 * 60 * 1000)
	return [from, to, median]
}

function getIdsList(){
	return CurrentData.find({"metrics.price.btc":{$exists: true}}, {fields: {_id: 1}} ).fetch()
}

function writeDailyDataFromHourlyData(date){
	const fields_to_avg = ['price_usd', 'price_btc']
	const fields_to_med = ['volume24_usd', 'volume24_btc', 'cap_usd', 'cap_btc', 'timestamp', 'source', 'systemId']
	let [from, to, median] = getFromToMedian(date)

	let systems = map(getIdsList(), '_id')
	let _selector = {
		timestamp: {$gte: from, $lt: to},
		interval: 'hourly'
	}
	function getDailyDataFromHourlyData(points) {
		if (points.length<1) return null
		let avgCounts = {}
		let avgs = {}
		fields_to_avg.forEach(fieldName => {avgCounts[fieldName] = 0; avgs[fieldName] = 0})
		let resultPoint = {}
		let medianPoint = points[0]

		points.forEach(function(point){
			if (point.timestamp < median) medianPoint = point
			fields_to_avg.forEach(function(fieldName){
				if (point[fieldName] != undefined && point[fieldName] != null) {
					avgCounts[fieldName]++;
					avgs[fieldName] += +point[fieldName]
				}
			})
		})
		fields_to_avg.forEach(fieldName => {
			resultPoint[fieldName] = (avgCounts[fieldName] > 0) ?
				avgs[fieldName]/avgCounts[fieldName] : undefined
		})
		fields_to_med.forEach(fieldName => {
			resultPoint[fieldName] = medianPoint[fieldName]
		})
    // supply
    if (medianPoint['supply']) {
      resultPoint['supply'] = medianPoint.supply
    } else {
  		if (+medianPoint['price_btc'] > 0)
  			resultPoint['supply'] = Math.round(medianPoint['cap_btc']/medianPoint['price_btc'])
    }
		resultPoint['interval'] = 'daily'
		return resultPoint
	}
	handleArrayWithInterval(systems, 500, function(systemId, callback){
		let selector = _.extend(_selector, {systemId: systemId})
		let points = MarketData.find(selector, {sort: {timestamp: 1}}).fetch()
		let result = getDailyDataFromHourlyData(points)
		//console.log(result ? result : systemId)
		if (result) try { MarketData.insert(result) } catch (e) {}
		if (callback) callback()
	})
}


module.exports = {
	writeDailyDataFromHourlyData: writeDailyDataFromHourlyData
}
