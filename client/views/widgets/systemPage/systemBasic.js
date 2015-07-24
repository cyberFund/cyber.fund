function systemName(){
  return Blaze._globalHelpers._toS(Router.current().params.name_);
}

Template['systemBasic'].rendered = function () {
  $('.scrollspy').scrollSpy();
};

Template['systemBasic'].helpers({
  'curData': function () {
    return CurrentData.findOne({
      system: systemName()
    });
  },
  'img_url': function () {
    return CF.Chaingear.helpers.cgSystemLogo(this);
  },
  'dependents': function(){
    return CurrentData.find(CF.CurrentData.selectors.dependents(systemName()), {sort: {system: 1}})
  },
  'dependentsExist': function(){
    return CurrentData.find(CF.CurrentData.selectors.dependents(systemName())).count();
  },
  'symbol': function(){
    return this.token ? this.token.token_symbol : ""
  },
  name_: function () {
    return Blaze._globalHelpers._toU(this.system);
  },
  displaySystem: function () { //see "ALIASES"
    return this.aliases.CurrencyName || this.nickname;
  },
  hashtag: function(){
    return (this.descriptions &&  this.descriptions.hashtag) ? this.descriptions.hashtag.slice(1): ""
  },
  existLinksWith: function(tag){
    var links = this.links;

    if (!_.isArray(links)) return false;
    return !!_.find(links, function(link){
      return (_.isArray(link.tags) &&link.tags.indexOf(tag) > -1);
    });
  }
});

Template['systemBasic'].events({
});

Template['systemBasic'].onCreated(function () {
  var instance= this;

  instance.autorun(function () {
    instance.subscribe('dependentCoins', systemName());
  /*    if (this.descriptions.twwidid) {
        twttr.widgets.createTimeline(
          "600756918018179072",
          document.getElementById("container"),
          {
            height: 400
          }
        );
      }
    })*/
  });
});


