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
  },
  dayToDayTradeVolumeChange: function(){
    var metrics = this.metrics;
    if (metrics.tradeVolumePrevious && metrics.tradeVolumePrevious.day)
      return CF.Utils.deltaPercents(metrics.tradeVolumePrevious.day, metrics.tradeVolume);
    return 0;
  },

  // todo: currently, those are using current price to estimate yesterday' trade volume.
  // not good. must be fixed soon.
  todayVolumeUsd: function(){
    if (this.metrics && this.metrics.tradeVolume && this.metrics.price)
    return this.metrics.tradeVolume * this.metrics.price.usd / this.metrics.price.btc;
    return 0;
  },
  yesterdayVolumeUsd: function(){
    var metrics = this.metrics;
    if (metrics && metrics.tradeVolumePrevious &&
      metrics.tradeVolumePrevious.day && metrics.price) {
      return metrics.price.usd / metrics.price.btc * metrics.tradeVolumePrevious.day;
    }
  },
  todayVolumeBtc: function(){
    if (this.metrics && this.metrics.tradeVolume && this.metrics.price)
      return this.metrics.tradeVolume;
    return 0;
  },
  yesterdayVolumeBtc: function(){
    var metrics = this.metrics;
    if (metrics && metrics.tradeVolumePrevious &&
      metrics.tradeVolumePrevious.day && metrics.price) {
      return metrics.tradeVolumePrevious.day;
    }
  },
  usdVolumeChange: function(){
    var metrics = this.metrics;
    if (metrics && metrics.tradeVolumePrevious &&
      metrics.tradeVolumePrevious.day && metrics.price
      && metrics.tradeVolume && metrics.price) {

      return CF.Utils.deltaPercents(metrics.price.usd  / metrics.price.btc * metrics.tradeVolume,
        metrics.price.usd / metrics.price.btc * metrics.tradeVolumePrevious.day);
    }
  },
  btcVolumeChange: function(){
    var metrics = this.metrics;
    if (metrics && metrics.tradeVolumePrevious &&
      metrics.tradeVolumePrevious.day
      && metrics.tradeVolume) {

      return CF.Utils.deltaPercents( metrics.tradeVolume,
         metrics.tradeVolumePrevious.day);
    }
  },
  main_links: function(){
    if (!this.links || !_.isArray(this.links)) {
      return [];
    }
    return _.where(links, function(link){
      return link.tags.indexOf("Main") > -1
    }).first(4);
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


