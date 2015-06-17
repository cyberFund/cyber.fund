Template['systemBasic'].rendered = function () {
  
};

Template['systemBasic'].helpers({
  'curData': function () {
    console.log(Router.current().params.name_);
    return CurrentData.findOne({
      name: Blaze._globalHelpers._toS(Router.current().params.name_)
    });
  },
  'img_name': function () {
    var ret = (this.icon ? this.icon : this.name) || '';
    return ret.toString().toLowerCase();
  },
});

Template['systemBasic'].events({
  'click .bar': function (e, t) {
    
  }
});