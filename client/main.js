import {Meteor} from 'meteor/meteor'

Meteor.startup(function() {
    console.log("11111111");
    Meteor.subscribe('extras_01', function(err, ret){

      console.log(err, ret);
    });
})
