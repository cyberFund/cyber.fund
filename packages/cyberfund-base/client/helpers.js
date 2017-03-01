import helpers from '/imports/api/client/cf/base/helpers'

_.each(helpers, function (helper, key) {
  Template.registerHelper(key, helper);
});
