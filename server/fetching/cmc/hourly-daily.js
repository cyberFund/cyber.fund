import hourly from '/imports/api/server/metrics/cmc-hourly'
import daily from '/imports/api/server/metrics/cmc-daily'
import {Meteor} from 'meteor/meteor'

SyncedCron.add({
	name: "averaging 5m cmc data to hourly",
	schedule: function(parser) {
		return parser.cron("1 * * * *", false);
	},
	job: function() {
		hourly.writeHourlyDataFrom5mData(new Date(new Date().valueOf() - 1000 * 60 * 20 ))
	}
})
SyncedCron.add({
	name: "averaging hourly cmc data to daily",
	schedule: function(parser) {
		return parser.cron("5 0 * * *", false);
	},
	job: function() {
		daily.writeDailyDataFromHourlyData(new Date(new Date().valueOf() - 1000 * 60 * 60 * 9 ))
	}
})


Meteor.startup(function(){ //only to be run once.
	const timestamp_min = 1488026402 * 1000
	const day = 24 * 3600 * 1000
	let date_iterator = new Date().valueOf() - day
	let interval = Meteor.setInterval(function(){
		date_iterator -= day;
		if (date_iterator > timestamp_min)
			daily.writeDailyDataFromHourlyData(new Date(date_iterator))
		else {
			Meteor.clearInterval(interval)
			console.log("DONE WITH DAILIES")
		}
	}, 4*60000)
})
