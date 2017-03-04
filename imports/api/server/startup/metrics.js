import cmc from '/imports/api/server/metrics/cmc'
import {Meteor} from 'meteor/meteor'

module.exports = function(){
  Meteor.startup(function(){
    Meteor.setTimeout(function(){
      cmc.reinit();
    }, 5000)
  })
}
