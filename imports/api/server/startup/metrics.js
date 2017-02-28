import cmc from '/imports/api/server/metrics/cmc'

module.exports = function(){
  Meteor.startup(function(){
    Meteor.setTimeout(function(){
      cmc.reinit();
    }, 5000)

    Meteor.setTimeout(function(){
      console.log(cmc)
    }, 10000)
  })
}
