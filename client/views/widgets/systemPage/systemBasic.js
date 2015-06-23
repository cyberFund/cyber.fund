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
    var ret = (this.icon ? this.icon : this.name) || '';
    ret= ret.toString().toLowerCase();
    return "https://raw.githubusercontent.com/cyberFund/chaingear/gh-pages/logos/"+ret+".png";
  }
});

Template['systemBasic'].events({
  'click .bar': function (e, t) {
    
  }
});