var cfCDs = CF.CurrentData .selectors;
// ??? not needed
Meteor.methods({
    "countByCurrencyName": function(name){
        return CurrentData.find(cfCDs.system(name)).count();
    }
});
