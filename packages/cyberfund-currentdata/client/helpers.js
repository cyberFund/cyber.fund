var helpers = {
  tagMatchesTags: function (tag, tags) {
    return tags.indexOf(tag) > -1;
  },

  linksWithTag: function(links, tag) { //todo: move to cyberfund-currentdata ?
    return CF.CurrentData.linksWithTag(links, tag)
  }
}

_.each(helpers, function(helper, key) {
  Template.registerHelper(key, helper);
});
