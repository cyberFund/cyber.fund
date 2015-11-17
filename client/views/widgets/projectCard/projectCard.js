Template['projectCard'].rendered = function () {
  
};

Template['projectCard'].helpers({
  name_: function () {
    return Blaze._globalHelpers._toUnderscores(this.system);
  }
});

Template['projectCard'].events({
  'click .bar': function (e, t) {
    
  }
});