import {CurrentData, MarketData} from '/imports/api/collections'
import {extend, map} from 'lodash'
import {handleArrayWithInterval} from '/imports/api/handleArray'

function startOfHour(date){
	if (!date instanceof Date) date = new Date()
	date.setUTCMinutes(0); date.setUTCSeconds(0); date.setUTCMilliseconds(0);
	return date;
}

function getFromToMedian(date) {
	let from = startOfHour(date)
	let to = new Date(from.valueOf() + 60 * 60 * 1000)
	let median = new Date(from.valueOf() + 30 * 60 * 1000)
	return [from, to, median]
}

function getIdsList(){
	return CurrentData.find({"metrics.price.btc":{$exists: true}}, {fields: {_id: 1}} ).fetch()
}

function writeHourlyDataFrom5mData(date){
	const fields_to_avg = ['price_usd', 'price_btc']
	const fields_to_med = ['volume24_usd', 'volume24_btc', 'cap_usd', 'cap_btc', 'timestamp', 'source', 'systemId']
	let [from, to, median] = getFromToMedian(date)

	let systems = map(getIdsList(), '_id')
	let _selector = {
		timestamp: {$gte: from, $lt: to},
		interval: '5m'
	}
	function getHourlyDataFrom5mData(points) {
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
		if (+medianPoint['price_btc'] > 0)
			resultPoint['supply'] = Math.round(medianPoint['cap_btc']/medianPoint['price_btc'])
		resultPoint['interval'] = 'hourly'
		return resultPoint
	}
	handleArrayWithInterval(systems, 700, function(systemId, callback){
		let selector = extend(_selector, {systemId: systemId})
		let points = MarketData.find(selector, {sort: {timestamp: 1}}).fetch()
		let result = getHourlyDataFrom5mData(points)
		//console.log(result ? result : systemId)
		if (result) try { MarketData.insert(result) } catch(e) {}
		if (callback) callback()
	})
}

function remove5mData(date) {
	if (!date instanceof Date) return
	let [from, to] = getFromToMedian(date)
	let selector = {
		timestamp: {$gte: from, $lt: to},
		interval: '5m'
	}
	MarketData.remove(selector)
}

module.exports = {
	writeHourlyDataFrom5mData: writeHourlyDataFrom5mData,
	remove5mData: remove5mData
}
