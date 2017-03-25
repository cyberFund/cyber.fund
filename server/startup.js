import startupDailies from '/imports/api/vetalPrices/syncedCronJob'

Meteor.startup(() => {
  startupDailies()
})
