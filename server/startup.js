import startDailies from '../imports/api/vetalPrices/syncedCronJob'

Meteor.startup(() => {
  console.log (startDailies)
  startDailies()
})
