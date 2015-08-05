Meteor.methods({
    "countByCurrencyName": function(name){
        return CurrentData.find(CF.CurrentData.selectors.system(name)).count();
    }
});