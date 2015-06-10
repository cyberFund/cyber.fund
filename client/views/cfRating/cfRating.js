Template['cfRating'].rendered = function () {
  
};

Template['cfRating'].helpers({
  'arr': function () {
    var ret = [];
    for (var i=0;i<this.rating;i++) ret.push(1);
    return ret;
  }
});

Template['cfRating'].events({
  'click .bar': function (e, t) {
    
  }
});