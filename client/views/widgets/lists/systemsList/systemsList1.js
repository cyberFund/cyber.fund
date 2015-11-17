Template['systemsList1'].rendered = function () {
  
};

Template['systemsList1'].helpers({
  'name_': function () {
    return Blaze._globalHelpers._toUnderscores(this.system);
  }
});

Template['systemsList1'].events({
  'click .bar': function (e, t) {
    
  }
});