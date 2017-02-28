import startupDailies from '/imports/api/vetalPrices/syncedCronJob'
import startupMetrics from   '/imports/api/server/startup/metrics'
Meteor.startup(() => {
  console.log ("startupDailies", startupDailies)
  startDailies()
  console.log ("startupMetrics", startupMetrics)
  startupMetrics()
})
