import chaingear from '/imports/api/server/chaingear'

module.exports = function(){
  Meteor.startup(function(){
    chaingear.reinit();
  })
}
