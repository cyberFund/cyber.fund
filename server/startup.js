import startupDailies from '/imports/api/vetalPrices/syncedCronJob'
import startupMetrics from   '/imports/api/server/startup/metrics'
import chaingear from '/imports/api/server/chaingear'
Meteor.startup(() => {
  console.log(chaingear)
  chaingear.reinit()
  startupDailies()
  startupMetrics()
})
