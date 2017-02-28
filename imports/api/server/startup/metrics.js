import {reinit, data} from '/imports/api/server/startup/metrics'

module.exports = function(){
  Meteor.startup(function(){
    reinit();
    console.log(data)
    Meteor.setTimeout(function(){
      console.log(data)
    }, 25000)
  })
}
