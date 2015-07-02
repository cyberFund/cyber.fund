// Write your package code here!

CF.Chaingear = {};
CF.Chaingear.collection = new Meteor.Collection("CurrentData");
CF.Chaingear.selector = {
    crowdsales: {crowdsales: {$exists: true}}
};
