Meteor.methods({
    "countByCurrencyName": function(name){
        return CurrentData.find(CF.CurrentData.selectors.name(name)).count();
    }
});