Template['systemBasic'].rendered = function () {

};

Template['systemBasic'].helpers({
  'curData': function () {
    console.log(Router.current().params.name_);
    return CurrentData.findOne({
      name: Blaze._globalHelpers._toS(Router.current().params.name_)
    });
  },
  'img_url': function () {
    return CF.Chaingear.helpers.cgIcon(this);
  }
});

Template['systemBasic'].events({
  'click .bar': function (e, t) {

  }
});
