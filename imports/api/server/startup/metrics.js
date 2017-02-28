import {reinit, data} from '/imports/api/server/metrics/cmc'

module.exports = function(){
  Meteor.startup(function(){
    reinit();
    console.log(data)
    Meteor.setTimeout(function(){
      console.log(data)
    }, 25000)
  })
}
