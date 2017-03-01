var helpers = {

}

_.each(helpers, function(helper, key) {
  Template.registerHelper(key, helper);
});
