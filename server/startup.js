import startupDailies from '/imports/api/vetalPrices/syncedCronJob'
import {updateUserFunds} from '/imports/api/userFunds/userHistory'
Meteor.startup(() => {
  startupDailies()
  //test
  updateUserFunds('bq3Cvd2gMEB4ss2AJ')
})
