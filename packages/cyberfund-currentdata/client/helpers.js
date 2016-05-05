var helpers = {
  tagMatchesTags: function (tag, tags) {
    return tags.indexOf(tag) > -1;
  },

  linksWithTag: function(links, tag) { //todo: move to cyberfund-currentdata ?
    return CF.CurrentData.linksWithTag(links, tag)
  },

  cdTurnover: function turnover () {
    var metrics = this.metrics;
      if (metrics.cap && metrics.cap.btc) {
          return 100.0 * metrics.turnover;
      }
    return 0;
  },

  cdSymbol: function symbol () {
    if (this.token && this.token.symbol) {
      return this.token.symbol
    }
    return "";
  },
}

_.each(helpers, function(helper, key) {
  Template.registerHelper(key, helper);
});
