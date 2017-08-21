import startupDailies from '/imports/api/dailyPrices/syncedCronJob'
Meteor.startup(() => {
  startupDailies()
})
