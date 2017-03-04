import chaingear from '/imports/api/server/chaingear'
import {Meteor} from 'meteor/meteor'

module.exports = function(){
  Meteor.startup(function(){
    chaingear.reinit();
  })
}
