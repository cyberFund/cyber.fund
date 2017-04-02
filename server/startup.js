import startupDailies from '/imports/api/vetalPrices/syncedCronJob'
import {updateUserFunds} from '/imports/api/userFunds/userHistory'
import {handleArrayWithInterval} from '/imports/api/handleArray'
Meteor.startup(() => {
  startupDailies()
  //one-shot for quick init. remove after deploy to dev
  handleArrayWithInterval(Meteor.users.find().fetch(), 50000, function(user, callback){
    updateUserFunds(user._id)
    console.log("done for " + user._id)
    if (callback) callback()
  })
})
