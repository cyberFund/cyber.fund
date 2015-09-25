// Write your package code here!

CF.Chaingear = {};
CF.Chaingear.collection = new Meteor.Collection("CurrentData"); //todo: merge.
CF.Chaingear.selector = {
    crowdsales: {crowdsales: {$exists: true}},
    crowdsalesUpcoming: {crowdsales: {$exists: true}, },

};
