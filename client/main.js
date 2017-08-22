import {Meteor} from 'meteor/meteor'

Meteor.startup(function() {
    console.log("starting 'main'");
    Meteor.subscribe('extras_01', function(err, ret){

      console.log(err, ret);
    });
})
